"""
Rotas de Fornecedores Protegidas e Melhoradas
Arquivo: backend/src/routes/fornecedores.py
"""

from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.fornecedor import Fornecedor
from src.routes.auth import token_required, admin_required
import re

fornecedores_bp = Blueprint('fornecedores', __name__)

def limpar_documento(documento):
    """Remove caracteres especiais de CPF/CNPJ"""
    if not documento:
        return None
    return re.sub(r'[^0-9]', '', str(documento))

def limpar_cep(cep):
    """Remove caracteres especiais do CEP"""
    if not cep:
        return None
    return re.sub(r'[^0-9]', '', str(cep))

@fornecedores_bp.route('/fornecedores', methods=['GET'])
@token_required
def listar_fornecedores():
    """Lista todos os fornecedores com filtros opcionais"""
    try:
        # Parâmetros de filtro
        tipo = request.args.get('tipo')
        ativo = request.args.get('ativo')
        busca = request.args.get('busca', '').strip()
        
        # Query base
        query = Fornecedor.query
        
        # Aplicar filtros
        if tipo and tipo in ['pessoa_fisica', 'pessoa_juridica']:
            query = query.filter(Fornecedor.tipo_fornecedor == tipo)
        
        if ativo is not None:
            ativo_bool = ativo.lower() in ['true', '1', 'sim']
            query = query.filter(Fornecedor.ativo == ativo_bool)
        
        if busca:
            query = query.filter(
                db.or_(
                    Fornecedor.nome.ilike(f'%{busca}%'),
                    Fornecedor.email.ilike(f'%{busca}%'),
                    Fornecedor.cpf.ilike(f'%{busca}%'),
                    Fornecedor.cnpj.ilike(f'%{busca}%')
                )
            )
        
        # Ordenação
        query = query.order_by(Fornecedor.nome)
        
        fornecedores = query.all()
        
        return jsonify({
            'success': True,
            'data': [fornecedor.to_dict() for fornecedor in fornecedores],
            'total': len(fornecedores)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar fornecedores: {str(e)}'
        }), 500

@fornecedores_bp.route('/fornecedores/<int:fornecedor_id>', methods=['GET'])
@token_required
def obter_fornecedor(fornecedor_id):
    """Obtém um fornecedor específico"""
    try:
        fornecedor = Fornecedor.query.get_or_404(fornecedor_id)
        
        return jsonify({
            'success': True,
            'data': fornecedor.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao obter fornecedor: {str(e)}'
        }), 500

@fornecedores_bp.route('/fornecedores', methods=['POST'])
@token_required
def criar_fornecedor():
    """Cria um novo fornecedor"""
    try:
        data = request.get_json()
        
        if not data or not data.get('nome') or not data.get('tipo_fornecedor'):
            return jsonify({
                'success': False,
                'message': 'Nome e tipo de fornecedor são obrigatórios'
            }), 400
        
        # Criar novo fornecedor
        fornecedor = Fornecedor(
            nome=data.get('nome', '').strip(),
            tipo_fornecedor=data.get('tipo_fornecedor'),
            cpf=limpar_documento(data.get('cpf', '')),
            cnpj=limpar_documento(data.get('cnpj', '')),
            email=data.get('email', '').strip() if data.get('email') else None,
            telefone=data.get('telefone', '').strip() if data.get('telefone') else None,
            endereco=data.get('endereco', '').strip() if data.get('endereco') else None,
            cidade=data.get('cidade', '').strip() if data.get('cidade') else None,
            estado=data.get('estado', '').strip() if data.get('estado') else None,
            cep=limpar_cep(data.get('cep', '')),
            ativo=data.get('ativo', True),
            observacoes=data.get('observacoes', '').strip() if data.get('observacoes') else None
        )
        
        # Validar dados
        errors = fornecedor.validate()
        if errors:
            return jsonify({
                'success': False,
                'message': 'Dados inválidos',
                'errors': errors
            }), 400
        
        # Verificar se já existe fornecedor com mesmo CPF/CNPJ
        if fornecedor.cpf:
            existing = Fornecedor.query.filter_by(cpf=fornecedor.cpf).first()
            if existing:
                return jsonify({'success': False, 'message': 'Já existe um fornecedor com este CPF'}), 400
        
        if fornecedor.cnpj:
            existing = Fornecedor.query.filter_by(cnpj=fornecedor.cnpj).first()
            if existing:
                return jsonify({'success': False, 'message': 'Já existe um fornecedor com este CNPJ'}), 400
        
        # Salvar no banco
        db.session.add(fornecedor)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Fornecedor criado com sucesso',
            'data': fornecedor.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao criar fornecedor: {str(e)}'
        }), 500

@fornecedores_bp.route('/fornecedores/<int:fornecedor_id>', methods=['PUT'])
@token_required
def atualizar_fornecedor(fornecedor_id):
    """Atualiza um fornecedor existente"""
    try:
        fornecedor = Fornecedor.query.get_or_404(fornecedor_id)
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos'
            }), 400
        
        # Atualizar campos
        if 'nome' in data:
            fornecedor.nome = data['nome'].strip()
        if 'tipo_fornecedor' in data:
            fornecedor.tipo_fornecedor = data['tipo_fornecedor']
        if 'cpf' in data:
            fornecedor.cpf = limpar_documento(data['cpf'])
        if 'cnpj' in data:
            fornecedor.cnpj = limpar_documento(data['cnpj'])
        if 'email' in data:
            fornecedor.email = data['email'].strip() if data['email'] else None
        if 'telefone' in data:
            fornecedor.telefone = data['telefone'].strip() if data['telefone'] else None
        if 'endereco' in data:
            fornecedor.endereco = data['endereco'].strip() if data['endereco'] else None
        if 'cidade' in data:
            fornecedor.cidade = data['cidade'].strip() if data['cidade'] else None
        if 'estado' in data:
            fornecedor.estado = data['estado'].strip() if data['estado'] else None
        if 'cep' in data:
            fornecedor.cep = limpar_cep(data['cep'])
        if 'ativo' in data:
            fornecedor.ativo = data['ativo']
        if 'observacoes' in data:
            fornecedor.observacoes = data['observacoes'].strip() if data['observacoes'] else None
        
        # Validar dados
        errors = fornecedor.validate()
        if errors:
            return jsonify({
                'success': False,
                'message': 'Dados inválidos',
                'errors': errors
            }), 400
        
        # Verificar duplicidade
        if fornecedor.cpf:
            existing = Fornecedor.query.filter(Fornecedor.cpf == fornecedor.cpf, Fornecedor.id != fornecedor_id).first()
            if existing:
                return jsonify({'success': False, 'message': 'Já existe outro fornecedor com este CPF'}), 400
        
        if fornecedor.cnpj:
            existing = Fornecedor.query.filter(Fornecedor.cnpj == fornecedor.cnpj, Fornecedor.id != fornecedor_id).first()
            if existing:
                return jsonify({'success': False, 'message': 'Já existe outro fornecedor com este CNPJ'}), 400
        
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Fornecedor atualizado com sucesso',
            'data': fornecedor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao atualizar fornecedor: {str(e)}'
        }), 500

@fornecedores_bp.route('/fornecedores/<int:fornecedor_id>', methods=['DELETE'])
@token_required
@admin_required
def excluir_fornecedor(fornecedor_id):
    """Exclui um fornecedor (apenas admin)"""
    try:
        fornecedor = Fornecedor.query.get_or_404(fornecedor_id)
        
        # Verificar se há documentos vinculados
        if hasattr(fornecedor, 'documentos') and fornecedor.documentos:
            return jsonify({
                'success': False,
                'message': f'Não é possível excluir o fornecedor. Existem documentos vinculados.'
            }), 400
        
        db.session.delete(fornecedor)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Fornecedor excluído com sucesso'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao excluir fornecedor: {str(e)}'
        }), 500
