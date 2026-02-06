from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Pasta(db.Model):
    __tablename__ = 'pastas'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    pasta_pai_id = db.Column(db.Integer, db.ForeignKey('pastas.id'), nullable=True)
    tipo_documento = db.Column(db.String(100), nullable=True)
    protegida = db.Column(db.Boolean, default=False)
    senha_hash = db.Column(db.String(255), nullable=True)
    criado_por = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    subpastas = db.relationship('Pasta', backref=db.backref('pasta_pai', remote_side=[id]), lazy=True)
    documentos = db.relationship('Documento', backref='pasta', lazy=True)
    permissoes = db.relationship('PermissaoPasta', backref='pasta', lazy=True, cascade='all, delete-orphan')
    atividades = db.relationship('RastreamentoAtividade', backref='pasta', lazy=True)
    
    def __repr__(self):
        return f'<Pasta {self.nome}>'
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'pasta_pai_id': self.pasta_pai_id,
            'tipo_documento': self.tipo_documento,
            'protegida': self.protegida,
            'criado_por': self.criado_por,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'total_documentos': len(self.documentos),
            'total_subpastas': len(self.subpastas)
        }
        
        return data
    
    def get_caminho_completo(self):
        """Retorna o caminho completo da pasta"""
        if self.pasta_pai:
            return f"{self.pasta_pai.get_caminho_completo()}/{self.nome}"
        return self.nome
    
    def get_todas_subpastas(self):
        """Retorna todas as subpastas recursivamente"""
        subpastas = []
        for subpasta in self.subpastas:
            subpastas.append(subpasta)
            subpastas.extend(subpasta.get_todas_subpastas())
        return subpastas
    
    def get_todos_documentos(self):
        """Retorna todos os documentos da pasta e subpastas"""
        documentos = list(self.documentos)
        for subpasta in self.subpastas:
            documentos.extend(subpasta.get_todos_documentos())
        return documentos
    
    def validate(self):
        """Valida os dados da pasta"""
        errors = []
        
        if not self.nome or len(self.nome.strip()) == 0:
            errors.append("Nome é obrigatório")
        
        # Verificar se não está criando uma referência circular
        if self.pasta_pai_id:
            pasta_atual = self
            while pasta_atual.pasta_pai:
                if pasta_atual.pasta_pai.id == self.id:
                    errors.append("Não é possível criar uma referência circular de pastas")
                    break
                pasta_atual = pasta_atual.pasta_pai
        
        return errors


class PermissaoPasta(db.Model):
    __tablename__ = 'permissoes_pasta'
    
    id = db.Column(db.Integer, primary_key=True)
    pasta_id = db.Column(db.Integer, db.ForeignKey('pastas.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pode_visualizar = db.Column(db.Boolean, default=False)
    pode_baixar = db.Column(db.Boolean, default=False)
    pode_alterar = db.Column(db.Boolean, default=False)
    pode_incluir = db.Column(db.Boolean, default=False)
    pode_excluir = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Constraint única para pasta + usuário
    __table_args__ = (db.UniqueConstraint('pasta_id', 'usuario_id', name='unique_pasta_usuario'),)
    
    def __repr__(self):
        return f'<PermissaoPasta pasta_id={self.pasta_id} usuario_id={self.usuario_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'pasta_id': self.pasta_id,
            'usuario_id': self.usuario_id,
            'pode_visualizar': self.pode_visualizar,
            'pode_baixar': self.pode_baixar,
            'pode_alterar': self.pode_alterar,
            'pode_incluir': self.pode_incluir,
            'pode_excluir': self.pode_excluir,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

