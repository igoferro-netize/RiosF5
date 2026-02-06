"""Rotas de Treinamento - Integradas ao Auth JWT (PyJWT)"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db, User
from src.models.treinamento import Treinamento, ProgressoTreinamento
from src.routes.auth import token_required

treinamento_bp = Blueprint('treinamento', __name__)

@treinamento_bp.route('/treinamentos', methods=['GET'])
@token_required
def listar_treinamentos():
    user = request.current_user
    treinamentos = Treinamento.query.filter_by(empresa_id=user.empresa_id, ativo=True).all()
    return jsonify({'success': True, 'data': [t.to_dict() for t in treinamentos]}), 200

@treinamento_bp.route('/treinamentos/<int:treinamento_id>', methods=['GET'])
@token_required
def obter_treinamento(treinamento_id):
    user = request.current_user
    treinamento = Treinamento.query.filter_by(id=treinamento_id, empresa_id=user.empresa_id).first()
    if not treinamento:
        return jsonify({'success': False, 'message': 'Treinamento não encontrado'}), 404

    progresso = ProgressoTreinamento.query.filter_by(usuario_id=user.id, treinamento_id=treinamento_id).first()
    payload = treinamento.to_dict()
    if progresso:
        payload['progresso'] = progresso.to_dict()
    return jsonify({'success': True, 'data': payload}), 200

@treinamento_bp.route('/treinamentos/<int:treinamento_id>/iniciar', methods=['POST'])
@token_required
def iniciar_treinamento(treinamento_id):
    user = request.current_user
    treinamento = Treinamento.query.filter_by(id=treinamento_id, empresa_id=user.empresa_id).first()
    if not treinamento:
        return jsonify({'success': False, 'message': 'Treinamento não encontrado'}), 404

    progresso = ProgressoTreinamento.query.filter_by(usuario_id=user.id, treinamento_id=treinamento_id).first()
    if not progresso:
        progresso = ProgressoTreinamento(usuario_id=user.id, treinamento_id=treinamento_id)
        db.session.add(progresso)
    db.session.commit()
    return jsonify({'success': True, 'data': progresso.to_dict()}), 200

@treinamento_bp.route('/treinamentos/<int:treinamento_id>/progresso', methods=['POST'])
@token_required
def atualizar_progresso(treinamento_id):
    user = request.current_user
    data = request.get_json() or {}
    progresso = ProgressoTreinamento.query.filter_by(usuario_id=user.id, treinamento_id=treinamento_id).first()
    if not progresso:
        return jsonify({'success': False, 'message': 'Progresso não encontrado'}), 404

    for field in ['tempo_assistido','porcentagem_concluida','tempo_com_presenca','ausencias_detectadas','tempo_olhando_tela','score_atencao_medio','pausas_por_desatencao']:
        if field in data:
            setattr(progresso, field, data[field])

    progresso.atualizar_status()
    db.session.commit()
    return jsonify({'success': True, 'data': progresso.to_dict()}), 200
