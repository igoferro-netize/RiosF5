"""
Rotas de Usuário Protegidas e Melhoradas
Arquivo: backend/src/routes/user.py
"""

from flask import Blueprint, jsonify, request
from src.models.user import User, db
from src.routes.auth import token_required, admin_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_users():
    """Lista todos os usuários (apenas admin)"""
    try:
        users = User.query.all()
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar usuários: {str(e)}'
        }), 500

@user_bp.route('/users', methods=['POST'])
@token_required
@admin_required
def create_user():
    """Cria um novo usuário (apenas admin)"""
    try:
        data = request.get_json()
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Username, email e password são obrigatórios'
            }), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'message': 'Email já cadastrado'}), 400
            
        user = User(
            username=data['username'], 
            email=data['email'],
            nome=data.get('nome'),
            role=data.get('role', 'user'),
            empresa_id=data.get('empresa_id'),
            ativo=data.get('ativo', True)
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Usuário criado com sucesso',
            'data': user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao criar usuário: {str(e)}'
        }), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    """Obtém um usuário específico (admin ou o próprio usuário)"""
    try:
        # Apenas admin ou o próprio usuário podem ver os dados
        if request.current_user.role != 'admin' and request.current_user.id != user_id:
            return jsonify({'success': False, 'message': 'Acesso negado'}), 403
            
        user = User.query.get_or_404(user_id)
        return jsonify({
            'success': True,
            'data': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao obter usuário: {str(e)}'
        }), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@token_required
def update_user(user_id):
    """Atualiza um usuário (admin ou o próprio usuário)"""
    try:
        # Apenas admin ou o próprio usuário podem atualizar
        if request.current_user.role != 'admin' and request.current_user.id != user_id:
            return jsonify({'success': False, 'message': 'Acesso negado'}), 403
            
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'nome' in data:
            user.nome = data['nome']
        if 'telefone' in data:
            user.telefone = data['telefone']
        if 'ativo' in data and request.current_user.role == 'admin':
            user.ativo = data['ativo']
        if 'role' in data and request.current_user.role == 'admin':
            user.role = data['role']
        if 'empresa_id' in data and request.current_user.role == 'admin':
            user.empresa_id = data['empresa_id']
            
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Usuário atualizado com sucesso',
            'data': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao atualizar usuário: {str(e)}'
        }), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    """Exclui um usuário (apenas admin)"""
    try:
        if request.current_user.id == user_id:
            return jsonify({'success': False, 'message': 'Não é possível excluir seu próprio usuário'}), 400
            
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Usuário excluído com sucesso'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao excluir usuário: {str(e)}'
        }), 500
