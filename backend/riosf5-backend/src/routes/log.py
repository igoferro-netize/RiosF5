"""
Rotas para Logs de Auditoria
Arquivo: backend/src/routes/log.py
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.log import Log
from src.models.user import User
from src.models.user import db
from datetime import datetime, timedelta

log_bp = Blueprint('log', __name__)

@log_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_logs():
    """Lista logs com filtros"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role not in ['master', 'admin']:
        return jsonify({'error': 'Permissão negada'}), 403

    # Parâmetros de filtro
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    acao = request.args.get('acao')
    user_id = request.args.get('user_id')
    empresa_id = request.args.get('empresa_id')
    data_inicio = request.args.get('data_inicio')
    data_fim = request.args.get('data_fim')

    query = Log.query

    if acao:
        query = query.filter(Log.acao.ilike(f'%{acao}%'))
    if user_id:
        query = query.filter_by(user_id=user_id)
    if empresa_id:
        query = query.filter_by(empresa_id=empresa_id)
    if data_inicio:
        query = query.filter(Log.data_hora >= datetime.fromisoformat(data_inicio))
    if data_fim:
        query = query.filter(Log.data_hora <= datetime.fromisoformat(data_fim))

    # Ordenar por data decrescente
    query = query.order_by(Log.data_hora.desc())

    # Paginação
    logs = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'logs': [{
            'id': l.id,
            'user_id': l.user_id,
            'empresa_id': l.empresa_id,
            'acao': l.acao,
            'descricao': l.descricao,
            'dados_antigos': l.dados_antigos,
            'dados_novos': l.dados_novos,
            'ip': l.ip,
            'user_agent': l.user_agent,
            'data_hora': l.data_hora.isoformat()
        } for l in logs.items],
        'total': logs.total,
        'pages': logs.pages,
        'current_page': logs.page
    })

@log_bp.route('/logs/stats', methods=['GET'])
@jwt_required()
def get_log_stats():
    """Estatísticas dos logs"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role not in ['master', 'admin']:
        return jsonify({'error': 'Permissão negada'}), 403

    # Últimos 30 dias
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    # Contagem por ação
    from sqlalchemy import func
    stats = db.session.query(
        Log.acao,
        func.count(Log.id).label('count')
    ).filter(Log.data_hora >= thirty_days_ago).group_by(Log.acao).all()

    return jsonify({
        'stats': {stat.acao: stat.count for stat in stats},
        'period': '30 days'
    })