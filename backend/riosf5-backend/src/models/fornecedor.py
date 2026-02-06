from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Fornecedor(db.Model):
    __tablename__ = 'fornecedores'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    tipo_fornecedor = db.Column(db.Enum('pessoa_fisica', 'pessoa_juridica', name='tipo_fornecedor'), nullable=False)
    cpf = db.Column(db.String(14), nullable=True)
    cnpj = db.Column(db.String(18), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    telefone = db.Column(db.String(20), nullable=True)
    endereco = db.Column(db.Text, nullable=True)
    cidade = db.Column(db.String(100), nullable=True)
    estado = db.Column(db.String(2), nullable=True)
    cep = db.Column(db.String(10), nullable=True)
    ativo = db.Column(db.Boolean, default=True)
    observacoes = db.Column(db.Text, nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    documentos = db.relationship('Documento', backref='fornecedor', lazy=True)
    
    def __repr__(self):
        return f'<Fornecedor {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'tipo_fornecedor': self.tipo_fornecedor,
            'cpf': self.cpf,
            'cnpj': self.cnpj,
            'email': self.email,
            'telefone': self.telefone,
            'endereco': self.endereco,
            'cidade': self.cidade,
            'estado': self.estado,
            'cep': self.cep,
            'ativo': self.ativo,
            'observacoes': self.observacoes,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }
    
    @staticmethod
    def validate_cpf(cpf):
        """Validação básica de CPF"""
        if not cpf:
            return False
        cpf = ''.join(filter(str.isdigit, cpf))
        return len(cpf) == 11
    
    @staticmethod
    def validate_cnpj(cnpj):
        """Validação básica de CNPJ"""
        if not cnpj:
            return False
        cnpj = ''.join(filter(str.isdigit, cnpj))
        return len(cnpj) == 14
    
    def validate(self):
        """Valida os dados do fornecedor"""
        errors = []
        
        if not self.nome or len(self.nome.strip()) == 0:
            errors.append("Nome é obrigatório")
        
        if self.tipo_fornecedor == 'pessoa_fisica':
            if not self.cpf:
                errors.append("CPF é obrigatório para pessoa física")
            elif not self.validate_cpf(self.cpf):
                errors.append("CPF inválido")
            if self.cnpj:
                errors.append("CNPJ não deve ser preenchido para pessoa física")
        
        elif self.tipo_fornecedor == 'pessoa_juridica':
            if not self.cnpj:
                errors.append("CNPJ é obrigatório para pessoa jurídica")
            elif not self.validate_cnpj(self.cnpj):
                errors.append("CNPJ inválido")
            if self.cpf:
                errors.append("CPF não deve ser preenchido para pessoa jurídica")
        
        if self.email and '@' not in self.email:
            errors.append("Email inválido")
        
        return errors

