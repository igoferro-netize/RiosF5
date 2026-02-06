from datetime import datetime
from src.models.user import db

class RastreamentoAtividade(db.Model):
    __tablename__ = 'rastreamento_atividades'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    acao = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    
    # Referências opcionais
    documento_id = db.Column(db.Integer, db.ForeignKey('documentos.id'), nullable=True)
    pasta_id = db.Column(db.Integer, db.ForeignKey('pastas.id'), nullable=True)
    
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    data_hora = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    usuario = db.relationship('User', backref='atividades', lazy=True)
    
    def __repr__(self):
        return f'<RastreamentoAtividade {self.acao} por {self.usuario_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'acao': self.acao,
            'descricao': self.descricao,
            'documento_id': self.documento_id,
            'pasta_id': self.pasta_id,
            'ip_address': self.ip_address,
            'data_hora': self.data_hora.isoformat() if self.data_hora else None
        }
