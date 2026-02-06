from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db
from src.models.agenda import AgendaEvento
from src.routes.auth import token_required

agenda_bp = Blueprint('agenda', __name__)

@agenda_bp.route('/agenda', methods=['GET'])
@token_required
def listar_eventos():
    user = request.current_user
    q = AgendaEvento.query.filter_by(empresa_id=user.empresa_id)
    # filtros simples
    inicio = request.args.get('inicio')
    fim = request.args.get('fim')
    if inicio:
        q = q.filter(AgendaEvento.data_inicio >= datetime.fromisoformat(inicio))
    if fim:
        q = q.filter(AgendaEvento.data_inicio <= datetime.fromisoformat(fim))
    eventos = q.order_by(AgendaEvento.data_inicio.asc()).all()
    return jsonify({'success': True, 'data': [e.to_dict() for e in eventos]}), 200

@agenda_bp.route('/agenda', methods=['POST'])
@token_required
def criar_evento_manual():
    user = request.current_user
    data = request.get_json() or {}
    evento = AgendaEvento(
        empresa_id=user.empresa_id,
        usuario_id=data.get('usuario_id'),
        origem_tipo='Manual',
        origem_id=None,
        titulo=data.get('titulo','').strip(),
        descricao=data.get('descricao'),
        data_inicio=datetime.fromisoformat(data['data_inicio']),
        data_fim=datetime.fromisoformat(data['data_fim']) if data.get('data_fim') else None,
        prioridade=data.get('prioridade','Media'),
        status=data.get('status','Pendente')
    )
    if not evento.titulo:
        return jsonify({'success': False, 'message': 'Título é obrigatório'}), 400
    db.session.add(evento)
    db.session.commit()
    return jsonify({'success': True, 'data': evento.to_dict()}), 201
