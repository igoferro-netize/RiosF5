"""
Modelo de Perfil para Empresas
Arquivo: backend/src/models/perfil.py
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Perfil(db.Model):
    __tablename__ = 'perfis'

    id = db.Column(db.Integer, primary_key=True)

    # Relacionamento com empresa
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)

    # Nome do perfil
    nome = db.Column(db.String(100), nullable=False)

    # Descrição
    descricao = db.Column(db.Text)

    # Permissões (JSON)
    permissoes = db.Column(db.Text, nullable=False)  # JSON string com permissões

    # Cores padrão
    cor_primaria = db.Column(db.String(7), default='#1e3a8a')
    cor_secundaria = db.Column(db.String(7), default='#3b82f6')

    # Logo padrão (URL)
    logo_url = db.Column(db.String(500))

    # Ativo
    ativo = db.Column(db.Boolean, default=True)

    # Timestamps
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    empresa = db.relationship('Empresa', backref='perfis', lazy=True)

    def __repr__(self):
        return f'<Perfil {self.nome} - Empresa {self.empresa_id}>'