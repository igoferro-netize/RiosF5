"""
Modelo de User Melhorado
Arquivo: backend/src/models/user.py
"""

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(200))
    telefone = db.Column(db.String(20))
    foto_perfil = db.Column(db.String(500))
    
    # Controle de acesso
    role = db.Column(db.String(20), default='user')  # admin, empresa, user
    ativo = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=True)
    
    # Timestamps
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ultimo_login = db.Column(db.DateTime)
    
    # Relacionamentos
    empresa = db.relationship('Empresa', backref='usuarios', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Hash da senha usando werkzeug"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifica se a senha está correta"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_sensitive=False):
        """Converte para dicionário (sem senha)"""
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'nome': self.nome,
            'telefone': self.telefone,
            'foto_perfil': self.foto_perfil,
            'role': self.role,
            'ativo': self.ativo,
            'empresa_id': self.empresa_id,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'ultimo_login': self.ultimo_login.isoformat() if self.ultimo_login else None
        }
        
        if include_sensitive:
            data['data_atualizacao'] = self.data_atualizacao.isoformat() if self.data_atualizacao else None
        
        return data
    
    @staticmethod
    def validate_email(email):
        """Validação básica de email"""
        return '@' in email and '.' in email.split('@')[1]
    
    def is_admin(self):
        """Verifica se o usuário é admin"""
        return self.role == 'admin'
    
    def can_access_empresa(self, empresa_id):
        """Verifica se o usuário pode acessar uma empresa"""
        if self.is_admin():
            return True
        return self.empresa_id == empresa_id
