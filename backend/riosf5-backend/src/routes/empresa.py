"""
Rotas de Empresa Completas
Arquivo: backend/src/routes/empresa.py
"""

from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.empresa import Empresa
from src.routes.auth import token_required, admin_required
import re

empresa_bp = Blueprint('empresa', __name__)


@empresa_bp.route('/empresas', methods=['GET'])
@token_required
def listar_empresas():
    """Lista todas as empresas com filtros opcionais"""
    try:
        # Apenas admins podem ver todas as empresas
        if request.current_user.role != 'admin':
            # Usuários comuns só veem sua própria empresa
            if request.current_user.empresa_id:
                empresa = Empresa.query.get(request.current_user.empresa_id)
                return jsonify({
                    'success': True,
                    'data': [empresa.to_dict()] if empresa else [],
                    'total': 1 if empresa else 0
                })
            else:
                return jsonify({
                    'success': True,
                    'data': [],
                    'total': 0
                })
        
        # Parâmetros de filtro
        status = request.args.get('status')
        plano = request.args.get('plano')
        ativo = request.args.get('ativo')
        busca = request.args.get('busca', '').strip()
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Query base
        query = Empresa.query
        
        # Aplicar filtros
        if status:
            query = query.filter(Empresa.status == status)
        
        if plano:
            query = query.filter(Empresa.plano == plano)
        
        if ativo is not None:
            ativo_bool = ativo.lower() in ['true', '1', 'sim']
            query = query.filter(Empresa.ativo == ativo_bool)
        
        if busca:
            query = query.filter(
                db.or_(
                    Empresa.razao_social.ilike(f'%{busca}%'),
                    Empresa.nome_fantasia.ilike(f'%{busca}%'),
                    Empresa.cnpj.ilike(f'%{busca}%'),
                    Empresa.email.ilike(f'%{busca}%')
                )
            )
        
        # Ordenação
        query = query.order_by(Empresa.razao_social)
        
        # Paginação
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'data': [empresa.to_dict() for empresa in pagination.items],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar empresas: {str(e)}'
        }), 500


@empresa_bp.route('/empresas/<int:empresa_id>', methods=['GET'])
@token_required
def obter_empresa(empresa_id):
    """Obtém uma empresa específica"""
    try:
        empresa = Empresa.query.get_or_404(empresa_id)
        
        # Verificar permissão
        if not request.current_user.can_access_empresa(empresa_id):
            return jsonify({
                'success': False,
                'message': 'Acesso negado'
            }), 403
        
        return jsonify({
            'success': True,
            'data': empresa.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao obter empresa: {str(e)}'
        }), 500


@empresa_bp.route('/empresas', methods=['POST'])
@token_required
@admin_required
def criar_empresa():
    """Cria uma nova empresa (apenas admin)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos'
            }), 400
        
        # Criar nova empresa
        empresa = Empresa(
            razao_social=data.get('razao_social', '').strip(),
            nome_fantasia=data.get('nome_fantasia', '').strip() if data.get('nome_fantasia') else None,
            cnpj=limpar_documento(data.get('cnpj', '')),
            inscricao_estadual=data.get('inscricao_estadual', '').strip() if data.get('inscricao_estadual') else None,
            inscricao_municipal=data.get('inscricao_municipal', '').strip() if data.get('inscricao_municipal') else None,
            email=data.get('email', '').strip() if data.get('email') else None,
            telefone=data.get('telefone', '').strip() if data.get('telefone') else None,
            site=data.get('site', '').strip() if data.get('site') else None,
            logradouro=data.get('logradouro', '').strip() if data.get('logradouro') else None,
            numero=data.get('numero', '').strip() if data.get('numero') else None,
            complemento=data.get('complemento', '').strip() if data.get('complemento') else None,
            bairro=data.get('bairro', '').strip() if data.get('bairro') else None,
            cidade=data.get('cidade', '').strip() if data.get('cidade') else None,
            estado=data.get('estado', '').strip() if data.get('estado') else None,
            cep=limpar_cep(data.get('cep', '')),
            responsavel_nome=data.get('responsavel_nome', '').strip() if data.get('responsavel_nome') else None,
            responsavel_email=data.get('responsavel_email', '').strip() if data.get('responsavel_email') else None,
            responsavel_telefone=data.get('responsavel_telefone', '').strip() if data.get('responsavel_telefone') else None,
            responsavel_cargo=data.get('responsavel_cargo', '').strip() if data.get('responsavel_cargo') else None,
            logo_url=data.get('logo_url', '').strip() if data.get('logo_url') else None,
            cor_primaria=data.get('cor_primaria', '#1e3a8a'),
            limite_usuarios=data.get('limite_usuarios', 10),
            permite_treinamentos=data.get('permite_treinamentos', True),
            permite_documentos=data.get('permite_documentos', True),
            plano=data.get('plano', 'basico'),
            valor_mensalidade=data.get('valor_mensalidade'),
            dia_vencimento=data.get('dia_vencimento', 10),
            forma_pagamento=data.get('forma_pagamento'),
            status=data.get('status', 'ativo'),
            ativo=data.get('ativo', True),
            observacoes=data.get('observacoes', '').strip() if data.get('observacoes') else None
        )
        
        # Validar dados
        errors = empresa.validate()
        if errors:
            return jsonify({
                'success': False,
                'message': 'Dados inválidos',
                'errors': errors
            }), 400
        
        # Verificar se já existe empresa com mesmo CNPJ
        existing = Empresa.query.filter_by(cnpj=empresa.cnpj).first()
        if existing:
            return jsonify({
                'success': False,
                'message': 'Já existe uma empresa com este CNPJ'
            }), 400
        
        # Salvar no banco
        db.session.add(empresa)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Empresa criada com sucesso',
            'data': empresa.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao criar empresa: {str(e)}'
        }), 500


@empresa_bp.route('/empresas/<int:empresa_id>', methods=['PUT'])
@token_required
def atualizar_empresa(empresa_id):
    """Atualiza uma empresa existente"""
    try:
        empresa = Empresa.query.get_or_404(empresa_id)
        
        # Verificar permissão
        if not request.current_user.can_access_empresa(empresa_id):
            return jsonify({
                'success': False,
                'message': 'Acesso negado'
            }), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos'
            }), 400
        
        # Atualizar campos (apenas admin pode alterar alguns campos)
        is_admin = request.current_user.is_admin()
        
        if 'razao_social' in data:
            empresa.razao_social = data['razao_social'].strip()
        if 'nome_fantasia' in data:
            empresa.nome_fantasia = data['nome_fantasia'].strip() if data['nome_fantasia'] else None
        if 'cnpj' in data and is_admin:
            empresa.cnpj = limpar_documento(data['cnpj'])
        if 'inscricao_estadual' in data:
            empresa.inscricao_estadual = data['inscricao_estadual'].strip() if data['inscricao_estadual'] else None
        if 'inscricao_municipal' in data:
            empresa.inscricao_municipal = data['inscricao_municipal'].strip() if data['inscricao_municipal'] else None
        if 'email' in data:
            empresa.email = data['email'].strip() if data['email'] else None
        if 'telefone' in data:
            empresa.telefone = data['telefone'].strip() if data['telefone'] else None
        if 'site' in data:
            empresa.site = data['site'].strip() if data['site'] else None
        
        # Endereço
        if 'logradouro' in data:
            empresa.logradouro = data['logradouro'].strip() if data['logradouro'] else None
        if 'numero' in data:
            empresa.numero = data['numero'].strip() if data['numero'] else None
        if 'complemento' in data:
            empresa.complemento = data['complemento'].strip() if data['complemento'] else None
        if 'bairro' in data:
            empresa.bairro = data['bairro'].strip() if data['bairro'] else None
        if 'cidade' in data:
            empresa.cidade = data['cidade'].strip() if data['cidade'] else None
        if 'estado' in data:
            empresa.estado = data['estado'].strip() if data['estado'] else None
        if 'cep' in data:
            empresa.cep = limpar_cep(data['cep'])
        
        # Responsável
        if 'responsavel_nome' in data:
            empresa.responsavel_nome = data['responsavel_nome'].strip() if data['responsavel_nome'] else None
        if 'responsavel_email' in data:
            empresa.responsavel_email = data['responsavel_email'].strip() if data['responsavel_email'] else None
        if 'responsavel_telefone' in data:
            empresa.responsavel_telefone = data['responsavel_telefone'].strip() if data['responsavel_telefone'] else None
        if 'responsavel_cargo' in data:
            empresa.responsavel_cargo = data['responsavel_cargo'].strip() if data['responsavel_cargo'] else None
        
        # Configurações
        if 'logo_url' in data:
            empresa.logo_url = data['logo_url'].strip() if data['logo_url'] else None
        if 'cor_primaria' in data:
            empresa.cor_primaria = data['cor_primaria']
        
        # Campos apenas para admin
        if is_admin:
            if 'limite_usuarios' in data:
                empresa.limite_usuarios = data['limite_usuarios']
            if 'permite_treinamentos' in data:
                empresa.permite_treinamentos = data['permite_treinamentos']
            if 'permite_documentos' in data:
                empresa.permite_documentos = data['permite_documentos']
            if 'plano' in data:
                empresa.plano = data['plano']
            if 'valor_mensalidade' in data:
                empresa.valor_mensalidade = data['valor_mensalidade']
            if 'dia_vencimento' in data:
                empresa.dia_vencimento = data['dia_vencimento']
            if 'forma_pagamento' in data:
                empresa.forma_pagamento = data['forma_pagamento']
            if 'status' in data:
                empresa.status = data['status']
            if 'ativo' in data:
                empresa.ativo = data['ativo']
        
        if 'observacoes' in data:
            empresa.observacoes = data['observacoes'].strip() if data['observacoes'] else None
        
        # Validar dados
        errors = empresa.validate()
        if errors:
            return jsonify({
                'success': False,
                'message': 'Dados inválidos',
                'errors': errors
            }), 400
        
        # Verificar se já existe outra empresa com mesmo CNPJ
        if is_admin and 'cnpj' in data:
            existing = Empresa.query.filter(
                Empresa.cnpj == empresa.cnpj,
                Empresa.id != empresa_id
            ).first()
            if existing:
                return jsonify({
                    'success': False,
                    'message': 'Já existe outra empresa com este CNPJ'
                }), 400
        
        # Salvar alterações
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Empresa atualizada com sucesso',
            'data': empresa.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao atualizar empresa: {str(e)}'
        }), 500


@empresa_bp.route('/empresas/<int:empresa_id>', methods=['DELETE'])
@token_required
@admin_required
def excluir_empresa(empresa_id):
    """Exclui uma empresa (soft delete - apenas admin)"""
    try:
        empresa = Empresa.query.get_or_404(empresa_id)
        
        # Verificar se há usuários vinculados
        if hasattr(empresa, 'usuarios') and empresa.usuarios:
            return jsonify({
                'success': False,
                'message': f'Não é possível excluir a empresa. Existem {len(empresa.usuarios)} usuário(s) vinculado(s).'
            }), 400
        
        # Soft delete (apenas desativa)
        empresa.ativo = False
        empresa.status = 'cancelado'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Empresa desativada com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Erro ao excluir empresa: {str(e)}'
        }), 500


@empresa_bp.route('/empresas/<int:empresa_id>/estatisticas', methods=['GET'])
@token_required
def obter_estatisticas_empresa(empresa_id):
    """Obtém estatísticas da empresa"""
    try:
        empresa = Empresa.query.get_or_404(empresa_id)
        
        # Verificar permissão
        if not request.current_user.can_access_empresa(empresa_id):
            return jsonify({
                'success': False,
                'message': 'Acesso negado'
            }), 403
        
        # TODO: Calcular estatísticas reais
        estatisticas = {
            'total_usuarios': len(empresa.usuarios) if hasattr(empresa, 'usuarios') else 0,
            'usuarios_ativos': sum(1 for u in empresa.usuarios if u.ativo) if hasattr(empresa, 'usuarios') else 0,
            'limite_usuarios': empresa.limite_usuarios,
            'total_treinamentos': 0,  # TODO: implementar
            'treinamentos_concluidos': 0,  # TODO: implementar
            'total_documentos': 0,  # TODO: implementar
            'total_certificados': 0,  # TODO: implementar
            'status': empresa.status,
            'plano': empresa.plano
        }
        
        return jsonify({
            'success': True,
            'data': estatisticas
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao obter estatísticas: {str(e)}'
        }), 500


def limpar_documento(documento):
    """Remove caracteres especiais de CPF/CNPJ"""
    if not documento:
        return None
    return re.sub(r'[^0-9]', '', documento)


def limpar_cep(cep):
    """Remove caracteres especiais do CEP"""
    if not cep:
        return None
    return re.sub(r'[^0-9]', '', cep)
