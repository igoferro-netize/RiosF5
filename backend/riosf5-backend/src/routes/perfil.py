"""
Rotas para Perfis
Arquivo: backend/src/routes/perfil.py
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.perfil import Perfil
from src.models.user import User
from src.models.empresa import Empresa
from src.models.user import db
import json

perfil_bp = Blueprint('perfil', __name__)

@perfil_bp.route('/perfis', methods=['GET'])
@jwt_required()
def get_perfis():
    """Lista perfis da empresa do usuário"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    # Master e admin podem ver todos, outros só da sua empresa
    if user.role in ['master', 'admin']:
        perfis = Perfil.query.all()
    else:
        perfis = Perfil.query.filter_by(empresa_id=user.empresa_id).all()

    return jsonify([{
        'id': p.id,
        'empresa_id': p.empresa_id,
        'nome': p.nome,
        'descricao': p.descricao,
        'permissoes': json.loads(p.permissoes) if p.permissoes else {},
        'cor_primaria': p.cor_primaria,
        'cor_secundaria': p.cor_secundaria,
        'logo_url': p.logo_url,
        'ativo': p.ativo
    } for p in perfis])

@perfil_bp.route('/perfis', methods=['POST'])
@jwt_required()
def create_perfil():
    """Cria novo perfil"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role not in ['master', 'admin', 'empresa_admin']:
        return jsonify({'error': 'Permissão negada'}), 403

    data = request.get_json()

    # Validar dados
    if not data.get('nome'):
        return jsonify({'error': 'Nome é obrigatório'}), 400

    if not data.get('permissoes'):
        return jsonify({'error': 'Permissões são obrigatórias'}), 400

    # Definir empresa_id
    empresa_id = data.get('empresa_id')
    if user.role in ['master', 'admin']:
        if not empresa_id:
            return jsonify({'error': 'Empresa é obrigatória para master/admin'}), 400
    else:
        empresa_id = user.empresa_id

    # Verificar se empresa existe
    empresa = Empresa.query.get(empresa_id)
    if not empresa:
        return jsonify({'error': 'Empresa não encontrada'}), 404

    # Criar perfil
    perfil = Perfil(
        empresa_id=empresa_id,
        nome=data['nome'],
        descricao=data.get('descricao', ''),
        permissoes=json.dumps(data['permissoes']),
        cor_primaria=data.get('cor_primaria', '#1e3a8a'),
        cor_secundaria=data.get('cor_secundaria', '#3b82f6'),
        logo_url=data.get('logo_url'),
        ativo=data.get('ativo', True)
    )

    db.session.add(perfil)
    db.session.commit()

    return jsonify({
        'id': perfil.id,
        'message': 'Perfil criado com sucesso'
    }), 201

@perfil_bp.route('/perfis/<int:perfil_id>', methods=['PUT'])
@jwt_required()
def update_perfil(perfil_id):
    """Atualiza perfil"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    perfil = Perfil.query.get(perfil_id)
    if not perfil:
        return jsonify({'error': 'Perfil não encontrado'}), 404

    # Verificar permissões
    if user.role not in ['master', 'admin'] and perfil.empresa_id != user.empresa_id:
        return jsonify({'error': 'Permissão negada'}), 403

    data = request.get_json()

    # Atualizar campos
    if 'nome' in data:
        perfil.nome = data['nome']
    if 'descricao' in data:
        perfil.descricao = data['descricao']
    if 'permissoes' in data:
        perfil.permissoes = json.dumps(data['permissoes'])
    if 'cor_primaria' in data:
        perfil.cor_primaria = data['cor_primaria']
    if 'cor_secundaria' in data:
        perfil.cor_secundaria = data['cor_secundaria']
    if 'logo_url' in data:
        perfil.logo_url = data['logo_url']
    if 'ativo' in data:
        perfil.ativo = data['ativo']

    db.session.commit()

    return jsonify({'message': 'Perfil atualizado com sucesso'})

@perfil_bp.route('/perfis/<int:perfil_id>', methods=['DELETE'])
@jwt_required()
def delete_perfil(perfil_id):
    """Deleta perfil"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    perfil = Perfil.query.get(perfil_id)
    if not perfil:
        return jsonify({'error': 'Perfil não encontrado'}), 404

    # Verificar permissões
    if user.role not in ['master', 'admin'] and perfil.empresa_id != user.empresa_id:
        return jsonify({'error': 'Permissão negada'}), 403

    db.session.delete(perfil)
    db.session.commit()

    return jsonify({'message': 'Perfil deletado com sucesso'})