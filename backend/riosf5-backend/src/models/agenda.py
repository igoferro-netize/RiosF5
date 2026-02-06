from datetime import datetime
from src.models.user import db

class AgendaEvento(db.Model):
    __tablename__ = 'agenda_eventos'

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # origem: Documento, Treinamento, Atividade, Checklist, Formulario, Manual
    origem_tipo = db.Column(db.String(50), nullable=False)
    origem_id = db.Column(db.Integer, nullable=True)
    
    # Chave estrangeira explícita para Documento para satisfazer o relacionamento
    documento_id = db.Column(db.Integer, db.ForeignKey('documentos.id'), nullable=True)

    titulo = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data_inicio = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=True)
    prioridade = db.Column(db.String(20), default='Media')
    status = db.Column(db.String(20), default='Pendente')

    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'empresa_id': self.empresa_id,
            'usuario_id': self.usuario_id,
            'origem_tipo': self.origem_tipo,
            'origem_id': self.origem_id,
            'documento_id': self.documento_id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'prioridade': self.prioridade,
            'status': self.status,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
        }
