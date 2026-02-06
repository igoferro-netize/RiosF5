"""
Modelo de Empresa Completo
Arquivo: backend/src/models/empresa.py
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Empresa(db.Model):
    __tablename__ = 'empresas'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Dados básicos
    razao_social = db.Column(db.String(255), nullable=False)
    nome_fantasia = db.Column(db.String(255))
    cnpj = db.Column(db.String(18), unique=True, nullable=False, index=True)
    inscricao_estadual = db.Column(db.String(50))
    inscricao_municipal = db.Column(db.String(50))
    
    # Contato
    email = db.Column(db.String(255))
    telefone = db.Column(db.String(20))
    site = db.Column(db.String(255))
    
    # Endereço
    logradouro = db.Column(db.String(255))
    numero = db.Column(db.String(20))
    complemento = db.Column(db.String(100))
    bairro = db.Column(db.String(100))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(2))
    cep = db.Column(db.String(10))
    
    # Responsável
    responsavel_nome = db.Column(db.String(200))
    responsavel_email = db.Column(db.String(255))
    responsavel_telefone = db.Column(db.String(20))
    responsavel_cargo = db.Column(db.String(100))
    
    # Configurações
    logo_url = db.Column(db.String(500))
    cor_primaria = db.Column(db.String(7), default='#1e3a8a')  # Hex color
    limite_usuarios = db.Column(db.Integer, default=10)
    permite_treinamentos = db.Column(db.Boolean, default=True)
    permite_documentos = db.Column(db.Boolean, default=True)
    
    # Financeiro
    plano = db.Column(db.String(50), default='basico')  # basico, intermediario, premium
    valor_mensalidade = db.Column(db.Numeric(10, 2))
    dia_vencimento = db.Column(db.Integer, default=10)
    forma_pagamento = db.Column(db.String(50))  # boleto, cartao, transferencia
    
    # Status
    status = db.Column(db.String(20), default='ativo')  # ativo, suspenso, cancelado, trial
    ativo = db.Column(db.Boolean, default=True)
    data_inicio_contrato = db.Column(db.Date)
    data_fim_contrato = db.Column(db.Date)
    
    # Observações
    observacoes = db.Column(db.Text)
    
    # Timestamps
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Empresa {self.razao_social}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'razao_social': self.razao_social,
            'nome_fantasia': self.nome_fantasia,
            'cnpj': self.cnpj,
            'inscricao_estadual': self.inscricao_estadual,
            'inscricao_municipal': self.inscricao_municipal,
            'email': self.email,
            'telefone': self.telefone,
            'site': self.site,
            'endereco': {
                'logradouro': self.logradouro,
                'numero': self.numero,
                'complemento': self.complemento,
                'bairro': self.bairro,
                'cidade': self.cidade,
                'estado': self.estado,
                'cep': self.cep
            },
            'responsavel': {
                'nome': self.responsavel_nome,
                'email': self.responsavel_email,
                'telefone': self.responsavel_telefone,
                'cargo': self.responsavel_cargo
            },
            'logo_url': self.logo_url,
            'cor_primaria': self.cor_primaria,
            'limite_usuarios': self.limite_usuarios,
            'permite_treinamentos': self.permite_treinamentos,
            'permite_documentos': self.permite_documentos,
            'plano': self.plano,
            'valor_mensalidade': float(self.valor_mensalidade) if self.valor_mensalidade else None,
            'dia_vencimento': self.dia_vencimento,
            'forma_pagamento': self.forma_pagamento,
            'status': self.status,
            'ativo': self.ativo,
            'data_inicio_contrato': self.data_inicio_contrato.isoformat() if self.data_inicio_contrato else None,
            'data_fim_contrato': self.data_fim_contrato.isoformat() if self.data_fim_contrato else None,
            'observacoes': self.observacoes,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'total_usuarios': len(self.usuarios) if hasattr(self, 'usuarios') else 0
        }
    
    @staticmethod
    def validate_cnpj(cnpj):
        """Validação básica de CNPJ"""
        if not cnpj:
            return False
        cnpj = ''.join(filter(str.isdigit, cnpj))
        return len(cnpj) == 14
    
    def validate(self):
        """Valida os dados da empresa"""
        errors = []
        
        if not self.razao_social or len(self.razao_social.strip()) == 0:
            errors.append("Razão social é obrigatória")
        
        if not self.cnpj:
            errors.append("CNPJ é obrigatório")
        elif not self.validate_cnpj(self.cnpj):
            errors.append("CNPJ inválido")
        
        if self.email and '@' not in self.email:
            errors.append("Email inválido")
        
        if self.limite_usuarios < 1:
            errors.append("Limite de usuários deve ser no mínimo 1")
        
        return errors
    
    def can_add_user(self):
        """Verifica se pode adicionar mais usuários"""
        if not hasattr(self, 'usuarios'):
            return True
        return len(self.usuarios) < self.limite_usuarios
    
    def is_active(self):
        """Verifica se a empresa está ativa"""
        return self.ativo and self.status == 'ativo'
