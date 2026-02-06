"""
Rotas de Cobrança e Controle Financeiro
Arquivo: backend/src/routes/cobranca.py
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from src.models.user import db, User
from src.models.empresa import Empresa
from src.models.cobranca import Contrato, Fatura
from src.routes.auth import token_required, master_required
from calendar import monthrange

cobranca_bp = Blueprint('cobranca', __name__)

@cobranca_bp.route('/contratos', methods=['GET'])
@token_required
def listar_contratos(current_user):
    """Lista contratos (master vê todos, outros veem apenas da empresa)"""
    if current_user.is_master():
        contratos = Contrato.query.all()
    elif current_user.empresa_id:
        contratos = Contrato.query.filter_by(empresa_id=current_user.empresa_id).all()
    else:
        return jsonify({'error': 'Usuário sem empresa vinculada'}), 403
    
    return jsonify([c.to_dict() for c in contratos]), 200


@cobranca_bp.route('/contratos/<int:empresa_id>', methods=['GET'])
@token_required
def obter_contrato_empresa(current_user, empresa_id):
    """Obtém contrato de uma empresa específica"""
    if not current_user.is_master() and current_user.empresa_id != empresa_id:
        return jsonify({'error': 'Acesso negado'}), 403
    
    contrato = Contrato.query.filter_by(empresa_id=empresa_id, ativo=True).first()
    if not contrato:
        return jsonify({'error': 'Contrato não encontrado'}), 404
    
    return jsonify(contrato.to_dict()), 200


@cobranca_bp.route('/contratos', methods=['POST'])
@master_required
def criar_contrato(current_user):
    """Cria novo contrato (apenas master)"""
    data = request.get_json()
    
    empresa_id = data.get('empresa_id')
    if not empresa_id:
        return jsonify({'error': 'empresa_id obrigatório'}), 400
    
    empresa = Empresa.query.get(empresa_id)
    if not empresa:
        return jsonify({'error': 'Empresa não encontrada'}), 404
    
    # Criar contrato
    contrato = Contrato(
        empresa_id=empresa_id,
        valor_mensal=data.get('valor_mensal', 0.0),
        quantidade_usuarios=data.get('quantidade_usuarios', 1),
        duracao_meses=data.get('duracao_meses', 12),
        dia_vencimento=data.get('dia_vencimento', 10),
        data_inicio=datetime.strptime(data.get('data_inicio'), '%Y-%m-%d').date() if data.get('data_inicio') else datetime.utcnow().date(),
        status='ativo',
        ativo=True
    )
    
    # Calcular data fim
    if contrato.duracao_meses:
        data_fim = contrato.data_inicio
        for _ in range(contrato.duracao_meses):
            # Avançar mês
            mes = data_fim.month + 1
            ano = data_fim.year
            if mes > 12:
                mes = 1
                ano += 1
            dia = min(data_fim.day, monthrange(ano, mes)[1])
            data_fim = data_fim.replace(year=ano, month=mes, day=dia)
        contrato.data_fim = data_fim
    
    db.session.add(contrato)
    db.session.commit()
    
    # Gerar faturas para os próximos meses
    gerar_faturas_automaticas(contrato)
    
    return jsonify(contrato.to_dict()), 201


@cobranca_bp.route('/contratos/<int:contrato_id>', methods=['PUT'])
@master_required
def atualizar_contrato(current_user, contrato_id):
    """Atualiza contrato (apenas master)"""
    contrato = Contrato.query.get(contrato_id)
    if not contrato:
        return jsonify({'error': 'Contrato não encontrado'}), 404
    
    data = request.get_json()
    
    if 'valor_mensal' in data:
        contrato.valor_mensal = data['valor_mensal']
    if 'quantidade_usuarios' in data:
        contrato.quantidade_usuarios = data['quantidade_usuarios']
    if 'dia_vencimento' in data:
        contrato.dia_vencimento = data['dia_vencimento']
    if 'status' in data:
        contrato.status = data['status']
    
    contrato.data_atualizacao = datetime.utcnow()
    db.session.commit()
    
    return jsonify(contrato.to_dict()), 200


@cobranca_bp.route('/faturas/<int:contrato_id>', methods=['GET'])
@token_required
def listar_faturas(current_user, contrato_id):
    """Lista faturas de um contrato"""
    contrato = Contrato.query.get(contrato_id)
    if not contrato:
        return jsonify({'error': 'Contrato não encontrado'}), 404
    
    if not current_user.is_master() and current_user.empresa_id != contrato.empresa_id:
        return jsonify({'error': 'Acesso negado'}), 403
    
    faturas = Fatura.query.filter_by(contrato_id=contrato_id).order_by(Fatura.data_vencimento.desc()).all()
    return jsonify([f.to_dict() for f in faturas]), 200


@cobranca_bp.route('/faturas/<int:fatura_id>/pagar', methods=['POST'])
@master_required
def pagar_fatura(current_user, fatura_id):
    """Marca fatura como paga e desbloqueia empresa (apenas master)"""
    fatura = Fatura.query.get(fatura_id)
    if not fatura:
        return jsonify({'error': 'Fatura não encontrada'}), 404
    
    fatura.marcar_como_pago()
    
    # Desbloquear empresa se não houver outras faturas atrasadas
    contrato = Contrato.query.get(fatura.contrato_id)
    faturas_atrasadas = Fatura.query.filter_by(contrato_id=contrato.id, status='atrasado').count()
    
    if faturas_atrasadas == 0:
        empresa = Empresa.query.get(contrato.empresa_id)
        empresa.desbloquear()
    
    db.session.commit()
    
    return jsonify({'message': 'Fatura paga com sucesso', 'fatura': fatura.to_dict()}), 200


@cobranca_bp.route('/verificar-inadimplencia', methods=['POST'])
@master_required
def verificar_inadimplencia(current_user):
    """Verifica e atualiza status de inadimplência de todos os contratos (apenas master)"""
    hoje = datetime.utcnow().date()
    contratos_atualizados = 0
    empresas_bloqueadas = 0
    
    contratos = Contrato.query.filter_by(ativo=True).all()
    
    for contrato in contratos:
        faturas = Fatura.query.filter_by(contrato_id=contrato.id).all()
        
        for fatura in faturas:
            if fatura.verificar_atraso():
                # Bloquear empresa se atraso > 5 dias
                if fatura.dias_atraso > 5:
                    empresa = Empresa.query.get(contrato.empresa_id)
                    if not empresa.bloqueado_por_inadimplencia:
                        empresa.bloquear(f"Fatura vencida há {fatura.dias_atraso} dias")
                        empresas_bloqueadas += 1
                
                contratos_atualizados += 1
    
    db.session.commit()
    
    return jsonify({
        'message': 'Verificação concluída',
        'contratos_atualizados': contratos_atualizados,
        'empresas_bloqueadas': empresas_bloqueadas
    }), 200


def gerar_faturas_automaticas(contrato):
    """Gera faturas automáticas para os próximos meses do contrato"""
    if not contrato.duracao_meses:
        return
    
    data_atual = contrato.data_inicio
    
    for i in range(contrato.duracao_meses):
        # Calcular vencimento em dia útil
        mes = data_atual.month
        ano = data_atual.year
        dia = contrato.dia_vencimento
        
        # Ajustar dia se não existir no mês
        ultimo_dia = monthrange(ano, mes)[1]
        if dia > ultimo_dia:
            dia = ultimo_dia
        
        data_vencimento = Contrato.calcular_vencimento_util(ano, mes, dia)
        
        # Criar fatura
        fatura = Fatura(
            contrato_id=contrato.id,
            valor=contrato.valor_mensal,
            data_vencimento=data_vencimento,
            status='pendente'
        )
        db.session.add(fatura)
        
        # Avançar para próximo mês
        mes += 1
        if mes > 12:
            mes = 1
            ano += 1
        data_atual = data_atual.replace(year=ano, month=mes, day=1)
    
    db.session.commit()
