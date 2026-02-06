from datetime import datetime
from src.models.user import db

class AprovacaoDocumento(db.Model):
    __tablename__ = 'aprovacoes_documento'
    id = db.Column(db.Integer, primary_key=True)
    documento_id = db.Column(db.Integer, db.ForeignKey('documentos.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pendente')
    observacoes = db.Column(db.Text)
    data_aprovacao = db.Column(db.DateTime, default=datetime.utcnow)
    # Novos campos para persistir tokens, ordem e assinatura
    token = db.Column(db.String(255), nullable=True, unique=False)
    ordem = db.Column(db.Integer, default=0)
    assinatura = db.Column(db.Text, nullable=True)
    acao = db.Column(db.String(20), nullable=True)
    token_expiracao = db.Column(db.DateTime, nullable=True)
    email_enviado = db.Column(db.Boolean, default=False)

class Notificacao(db.Model):
    __tablename__ = 'notificacoes'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    documento_id = db.Column(db.Integer, db.ForeignKey('documentos.id'), nullable=True)
    titulo = db.Column(db.String(200), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    lida = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

class Compartilhamento(db.Model):
    __tablename__ = 'compartilhamentos'
    id = db.Column(db.Integer, primary_key=True)
    documento_id = db.Column(db.Integer, db.ForeignKey('documentos.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(100), unique=True)
    data_expiracao = db.Column(db.DateTime)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
