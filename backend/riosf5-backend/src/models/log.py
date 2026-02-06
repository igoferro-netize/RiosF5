"""
Modelo de Log para Auditoria
Arquivo: backend/src/models/log.py
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Log(db.Model):
    __tablename__ = 'logs'

    id = db.Column(db.Integer, primary_key=True)

    # Usuário que realizou a ação
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    # Empresa relacionada (se aplicável)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=True)

    # Ação realizada
    acao = db.Column(db.String(100), nullable=False)  # login, create_user, update_empresa, etc.

    # Descrição da ação
    descricao = db.Column(db.Text, nullable=False)

    # Dados antigos (JSON, para auditoria)
    dados_antigos = db.Column(db.Text)

    # Dados novos (JSON, para auditoria)
    dados_novos = db.Column(db.Text)

    # IP do usuário
    ip = db.Column(db.String(45))  # IPv6 support

    # User Agent
    user_agent = db.Column(db.Text)

    # Timestamp
    data_hora = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamentos
    user = db.relationship('User', backref='logs', lazy=True)
    empresa = db.relationship('Empresa', backref='logs', lazy=True)

    def __repr__(self):
        return f'<Log {self.acao} - User {self.user_id} - {self.data_hora}>'