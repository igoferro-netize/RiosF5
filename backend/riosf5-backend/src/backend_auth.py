"""
Sistema de Autenticação JWT Completo para RiosF5
Arquivo: backend/src/routes/auth.py
"""

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps
from src.models.user import User, db

auth_bp = Blueprint('auth', __name__)

# Configurações JWT
JWT_SECRET = os.getenv('JWT_SECRET', 'change-this-secret-key-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600  # 1 hora
REFRESH_EXP_DELTA_DAYS = 30  # 30 dias

# Blacklist de tokens (em produção, usar Redis)
token_blacklist = set()


def generate_token(user_id, token_type='access'):
    """Gera um token JWT para o usuário"""
    expiration = datetime.utcnow() + (
        timedelta(seconds=JWT_EXP_DELTA_SECONDS) if token_type == 'access'
        else timedelta(days=REFRESH_EXP_DELTA_DAYS)
    )
    
    payload = {
        'user_id': user_id,
        'type': token_type,
        'exp': expiration,
        'iat': datetime.utcnow()
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token):
    """Decodifica e valida um token JWT"""
    try:
        if token in token_blacklist:
            return None
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def token_required(f):
    """Decorator para proteger rotas que exigem autenticação"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Obter token do header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'success': False, 'message': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'success': False, 'message': 'Token não fornecido'}), 401
        
        # Decodificar token
        payload = decode_token(token)
        if not payload:
            return jsonify({'success': False, 'message': 'Token inválido ou expirado'}), 401
        
        # Verificar tipo de token
        if payload.get('type') != 'access':
            return jsonify({'success': False, 'message': 'Tipo de token inválido'}), 401
        
        # Obter usuário
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'success': False, 'message': 'Usuário não encontrado'}), 401
        
        # Adicionar usuário ao contexto da requisição
        request.current_user = user
        
        return f(*args, **kwargs)
    
    return decorated


def admin_required(f):
    """Decorator para rotas que exigem privilégios de admin"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'current_user'):
            return jsonify({'success': False, 'message': 'Não autenticado'}), 401
        
        if request.current_user.role != 'admin':
            return jsonify({'success': False, 'message': 'Acesso negado: privilégios de admin necessários'}), 403
        
        return f(*args, **kwargs)
    
    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    """Registra um novo usuário"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'Campo {field} é obrigatório'
                }), 400
        
        # Validar email
        if '@' not in data['email']:
            return jsonify({
                'success': False,
                'message': 'Email inválido'
            }), 400
        
        # Validar senha
        if len(data['password']) < 6:
            return jsonify({
                'success': False,
                'message': 'Senha deve ter no mínimo 6 caracteres'
            }), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'message': 'Email já cadastrado'
            }), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({
                'success': False,
                'message': 'Nome de usuário já existe'
            }), 400
        
        # Criar novo usuário
        user = User(
            username=data['username'],
            email=data['email'],
            nome=data.get('nome', data['username']),
            role=data.get('role', 'user'),
            ativo=True
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Usuário cadastrado com sucesso',
            'data': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao registrar usuário: {str(e)}'
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Autentica um usuário e retorna tokens JWT"""
    try:
        data = request.get_json()
        
        # Validar dados
        if not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email e senha são obrigatórios'
            }), 400
        
        # Buscar usuário
        user = User.query.filter_by(email=data['email']).first()
        
        # Verificar credenciais
        if not user or not user.check_password(data['password']):
            return jsonify({
                'success': False,
                'message': 'Email ou senha incorretos'
            }), 401
        
        # Verificar se usuário está ativo
        if not user.ativo:
            return jsonify({
                'success': False,
                'message': 'Usuário inativo. Entre em contato com o administrador.'
            }), 403
        
        # Gerar tokens
        access_token = generate_token(user.id, 'access')
        refresh_token = generate_token(user.id, 'refresh')
        
        # Atualizar último login
        user.ultimo_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Login realizado com sucesso',
            'data': {
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer',
                'expires_in': JWT_EXP_DELTA_SECONDS
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao fazer login: {str(e)}'
        }), 500


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Renova o access token usando um refresh token válido"""
    try:
        data = request.get_json()
        
        if not data.get('refresh_token'):
            return jsonify({
                'success': False,
                'message': 'Refresh token não fornecido'
            }), 400
        
        # Decodificar refresh token
        payload = decode_token(data['refresh_token'])
        
        if not payload or payload.get('type') != 'refresh':
            return jsonify({
                'success': False,
                'message': 'Refresh token inválido ou expirado'
            }), 401
        
        # Verificar usuário
        user = User.query.get(payload['user_id'])
        if not user or not user.ativo:
            return jsonify({
                'success': False,
                'message': 'Usuário não encontrado ou inativo'
            }), 401
        
        # Gerar novo access token
        new_access_token = generate_token(user.id, 'access')
        
        return jsonify({
            'success': True,
            'message': 'Token renovado com sucesso',
            'data': {
                'access_token': new_access_token,
                'token_type': 'Bearer',
                'expires_in': JWT_EXP_DELTA_SECONDS
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao renovar token: {str(e)}'
        }), 500


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Invalida o token atual (logout)"""
    try:
        # Obter token do header
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.split(' ')[1] if ' ' in auth_header else ''
        
        if token:
            # Adicionar à blacklist
            token_blacklist.add(token)
        
        return jsonify({
            'success': True,
            'message': 'Logout realizado com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao fazer logout: {str(e)}'
        }), 500


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    """Retorna informações do usuário autenticado"""
    try:
        user = request.current_user
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao obter usuário: {str(e)}'
        }), 500


@auth_bp.route('/change-password', methods=['POST'])
@token_required
def change_password():
    """Altera a senha do usuário autenticado"""
    try:
        data = request.get_json()
        user = request.current_user
        
        # Validar dados
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({
                'success': False,
                'message': 'Senha atual e nova senha são obrigatórias'
            }), 400
        
        # Verificar senha atual
        if not user.check_password(data['current_password']):
            return jsonify({
                'success': False,
                'message': 'Senha atual incorreta'
            }), 401
        
        # Validar nova senha
        if len(data['new_password']) < 6:
            return jsonify({
                'success': False,
                'message': 'Nova senha deve ter no mínimo 6 caracteres'
            }), 400
        
        # Atualizar senha
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Senha alterada com sucesso'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao alterar senha: {str(e)}'
        }), 500


@auth_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    """Solicita reset de senha (envia email)"""
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({
                'success': False,
                'message': 'Email é obrigatório'
            }), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        # Por segurança, sempre retornar sucesso mesmo se email não existir
        if user:
            # TODO: Gerar token de reset e enviar email
            # reset_token = generate_token(user.id, 'reset')
            # send_password_reset_email(user.email, reset_token)
            pass
        
        return jsonify({
            'success': True,
            'message': 'Se o email estiver cadastrado, você receberá as instruções para resetar a senha'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao processar solicitação: {str(e)}'
        }), 500


# Helper function para verificar permissões customizadas
def has_permission(user, permission):
    """Verifica se usuário tem uma permissão específica"""
    # TODO: Implementar sistema de permissões granular
    if user.role == 'admin':
        return True
    
    # Adicionar lógica de permissões conforme necessário
    return False
