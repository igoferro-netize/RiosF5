from flask import Blueprint, request, jsonify
from src.models.documento import Documento
from src.models.auxiliares import AprovacaoDocumento
from src.models.user import db
from datetime import datetime

documentos_bp = Blueprint('documentos', __name__)

@documentos_bp.route('/', methods=['POST'])
def criar_documento():
    data = request.get_json() or {}
    # Campos mínimos esperados
    doc = Documento(
        nome=data.get('nome', 'Documento sem nome'),
        nome_arquivo=data.get('nome_arquivo', ''),
        caminho_arquivo=data.get('caminho_arquivo', ''),
        tipo_arquivo=data.get('tipo_arquivo', 'pdf'),
        tamanho_arquivo=data.get('tamanho_arquivo', 0),
        categoria=data.get('categoria', 'geral'),
        pasta_id=data.get('pasta_id', 1) or 1,
        responsavel_id=data.get('responsavel_id', 1) or 1,
        criado_por=data.get('criado_por', 1) or 1,
        protegido_senha=bool(data.get('protegido_senha', False)),
        senha_hash=data.get('senha_hash')
    )
    db.session.add(doc)
    db.session.commit()
    return jsonify({'ok': True, 'documento': doc.to_dict(include_sensitive=True)}), 201

@documentos_bp.route('/<int:doc_id>/aprovacoes', methods=['POST'])
def criar_aprovacoes(doc_id):
    data = request.get_json() or {}
    aprovadores = data.get('aprovadores', [])
    created = []
    for ap in aprovadores:
        item = AprovacaoDocumento(
            documento_id=doc_id,
            usuario_id=ap.get('usuario_id'),
            status=ap.get('status', 'pendente'),
            observacoes=ap.get('observacoes'),
            ordem=ap.get('ordem', 0),
            token=ap.get('token')
        )
        db.session.add(item)
        created.append(item)
    db.session.commit()
    return jsonify({'ok': True, 'aprovacoes': [ { 'id': a.id, 'usuario_id': a.usuario_id, 'token': a.token } for a in created ]}), 201

@documentos_bp.route('/aprovacoes/validar', methods=['GET'])
def validar_token():
    token = request.args.get('token')
    if not token:
        return jsonify({'ok': False, 'error': 'token ausente'}), 400
    aprov = AprovacaoDocumento.query.filter_by(token=token).first()
    if not aprov:
        return jsonify({'ok': False, 'error': 'token inválido'}), 404
    doc = aprov.documento
    return jsonify({'ok': True, 'aprovacao': {
        'id': aprov.id,
        'documento_id': aprov.documento_id,
        'usuario_id': aprov.usuario_id,
        'status': aprov.status,
        'observacoes': aprov.observacoes,
        'ordem': aprov.ordem,
        'assinatura': aprov.assinatura
    }, 'documento': doc.to_dict()}), 200

@documentos_bp.route('/aprovacoes/<int:aprov_id>/acao', methods=['POST'])
def acao_aprovacao(aprov_id):
    data = request.get_json() or {}
    aprov = AprovacaoDocumento.query.get(aprov_id)
    if not aprov:
        return jsonify({'ok': False, 'error': 'aprovacao não encontrada'}), 404
    token = data.get('token')
    # Se token for fornecido, certifique-se que bate com o registrado (se existir)
    if aprov.token and token and aprov.token != token:
        return jsonify({'ok': False, 'error': 'token inválido para esta aprovação'}), 403
    aprov.acao = data.get('acao')
    aprov.assinatura = data.get('assinatura')
    aprov.status = data.get('acao') or aprov.status
    aprov.data_aprovacao = datetime.utcnow()
    db.session.commit()
    return jsonify({'ok': True, 'aprovacao': {
        'id': aprov.id,
        'status': aprov.status,
        'acao': aprov.acao,
        'assinatura': aprov.assinatura,
        'data_aprovacao': aprov.data_aprovacao.isoformat() if aprov.data_aprovacao else None
    }}), 200
