from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from decimal import Decimal
from src.models.user import db

class Documento(db.Model):
    __tablename__ = 'documentos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    nome_arquivo = db.Column(db.String(255), nullable=False)
    caminho_arquivo = db.Column(db.String(500), nullable=False)
    tipo_arquivo = db.Column(db.String(10), nullable=False)
    tamanho_arquivo = db.Column(db.BigInteger, nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    pasta_id = db.Column(db.Integer, db.ForeignKey('pastas.id'), nullable=False)
    grupo = db.Column(db.String(100), nullable=True)
    revisao = db.Column(db.String(50), default='1.0')
    status = db.Column(db.Enum('ativo', 'vencido', 'vencendo', 'inativo', 'pendente_aprovacao', name='status_documento'), default='ativo')
    data_vencimento = db.Column(db.Date, nullable=True)
    responsavel_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pessoa_notificacao_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    dias_antes_vencimento = db.Column(db.Integer, default=30)
    protegido_senha = db.Column(db.Boolean, default=False)
    senha_hash = db.Column(db.String(255), nullable=True)
    documento_controlado = db.Column(db.Boolean, default=False)
    contrato_vigente = db.Column(db.Boolean, default=False)
    lgbt_compliance = db.Column(db.Boolean, default=False)
    observacoes = db.Column(db.Text, nullable=True)
    
    # Campos específicos para contratos e fornecedores
    fornecedor_id = db.Column(db.Integer, db.ForeignKey('fornecedores.id'), nullable=True)
    tipo_contrato = db.Column(db.String(100), nullable=True)
    valor_contrato = db.Column(db.Numeric(15, 2), nullable=True)
    moeda = db.Column(db.String(3), default='BRL')
    prazo_pagamento = db.Column(db.Integer, nullable=True)  # Dias para pagamento
    data_inicio_contrato = db.Column(db.Date, nullable=True)
    data_fim_contrato = db.Column(db.Date, nullable=True)
    reajuste_percentual = db.Column(db.Numeric(5, 2), nullable=True)
    reajuste_indice = db.Column(db.String(50), nullable=True)
    reajuste_periodicidade = db.Column(db.Enum('mensal', 'trimestral', 'semestral', 'anual', name='periodicidade_reajuste'), nullable=True)
    multa_atraso_percentual = db.Column(db.Numeric(5, 2), nullable=True)
    multa_rescisao_valor = db.Column(db.Numeric(15, 2), nullable=True)
    multa_descricao = db.Column(db.Text, nullable=True)
    clausulas_especiais = db.Column(db.Text, nullable=True)
    renovacao_automatica = db.Column(db.Boolean, default=False)
    
    criado_por = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    data_upload = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    aprovacoes = db.relationship('AprovacaoDocumento', backref='documento', lazy=True, cascade='all, delete-orphan')
    notificacoes = db.relationship('Notificacao', backref='documento', lazy=True, cascade='all, delete-orphan')
    compartilhamentos = db.relationship('Compartilhamento', backref='documento', lazy=True, cascade='all, delete-orphan')
    atividades = db.relationship('RastreamentoAtividade', backref='documento', lazy=True)
    eventos_agenda = db.relationship('AgendaEvento', backref='documento', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Documento {self.nome}>'
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'nome': self.nome,
            'nome_arquivo': self.nome_arquivo,
            'tipo_arquivo': self.tipo_arquivo,
            'tamanho_arquivo': self.tamanho_arquivo,
            'categoria': self.categoria,
            'pasta_id': self.pasta_id,
            'grupo': self.grupo,
            'revisao': self.revisao,
            'status': self.status,
            'data_vencimento': self.data_vencimento.isoformat() if self.data_vencimento else None,
            'responsavel_id': self.responsavel_id,
            'pessoa_notificacao_id': self.pessoa_notificacao_id,
            'dias_antes_vencimento': self.dias_antes_vencimento,
            'protegido_senha': self.protegido_senha,
            'documento_controlado': self.documento_controlado,
            'contrato_vigente': self.contrato_vigente,
            'lgbt_compliance': self.lgbt_compliance,
            'observacoes': self.observacoes,
            'fornecedor_id': self.fornecedor_id,
            'tipo_contrato': self.tipo_contrato,
            'valor_contrato': float(self.valor_contrato) if self.valor_contrato else None,
            'moeda': self.moeda,
            'prazo_pagamento': self.prazo_pagamento,
            'data_inicio_contrato': self.data_inicio_contrato.isoformat() if self.data_inicio_contrato else None,
            'data_fim_contrato': self.data_fim_contrato.isoformat() if self.data_fim_contrato else None,
            'reajuste_percentual': float(self.reajuste_percentual) if self.reajuste_percentual else None,
            'reajuste_indice': self.reajuste_indice,
            'reajuste_periodicidade': self.reajuste_periodicidade,
            'multa_atraso_percentual': float(self.multa_atraso_percentual) if self.multa_atraso_percentual else None,
            'multa_rescisao_valor': float(self.multa_rescisao_valor) if self.multa_rescisao_valor else None,
            'multa_descricao': self.multa_descricao,
            'clausulas_especiais': self.clausulas_especiais,
            'renovacao_automatica': self.renovacao_automatica,
            'criado_por': self.criado_por,
            'data_upload': self.data_upload.isoformat() if self.data_upload else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }
        
        if include_sensitive:
            data['caminho_arquivo'] = self.caminho_arquivo
        
        return data
    
    def calcular_dias_vencimento(self):
        """Calcula quantos dias faltam para o vencimento"""
        if not self.data_vencimento:
            return None
        
        hoje = date.today()
        diff = (self.data_vencimento - hoje).days
        return diff
    
    def calcular_dias_fim_contrato(self):
        """Calcula quantos dias faltam para o fim do contrato"""
        if not self.data_fim_contrato:
            return None
        
        hoje = date.today()
        diff = (self.data_fim_contrato - hoje).days
        return diff
    
    def get_status_calculado(self):
        """Calcula o status baseado na data de vencimento"""
        if not self.data_vencimento:
            return 'sem_vencimento'
        
        dias = self.calcular_dias_vencimento()
        
        if dias < 0:
            return 'vencido'
        elif dias <= self.dias_antes_vencimento:
            return 'vencendo'
        else:
            return 'ativo'
    
    def get_status_contrato(self):
        """Calcula o status do contrato baseado na data de fim"""
        if not self.data_fim_contrato:
            return None
        
        dias = self.calcular_dias_fim_contrato()
        
        if dias < 0:
            return 'contrato_vencido'
        elif dias <= 30:  # 30 dias antes do vencimento
            return 'contrato_vencendo'
        else:
            return 'contrato_vigente'
    
    def validate(self):
        """Valida os dados do documento"""
        errors = []
        
        if not self.nome or len(self.nome.strip()) == 0:
            errors.append("Nome é obrigatório")
        
        if not self.nome_arquivo or len(self.nome_arquivo.strip()) == 0:
            errors.append("Nome do arquivo é obrigatório")
        
        if not self.caminho_arquivo or len(self.caminho_arquivo.strip()) == 0:
            errors.append("Caminho do arquivo é obrigatório")
        
        if not self.tipo_arquivo or len(self.tipo_arquivo.strip()) == 0:
            errors.append("Tipo do arquivo é obrigatório")
        
        if not self.categoria or len(self.categoria.strip()) == 0:
            errors.append("Categoria é obrigatória")
        
        if self.tamanho_arquivo <= 0:
            errors.append("Tamanho do arquivo deve ser maior que zero")
        
        if self.data_inicio_contrato and self.data_fim_contrato:
            if self.data_inicio_contrato >= self.data_fim_contrato:
                errors.append("Data de início do contrato deve ser anterior à data de fim")
        
        if self.valor_contrato and self.valor_contrato < 0:
            errors.append("Valor do contrato não pode ser negativo")
        
        if self.reajuste_percentual and (self.reajuste_percentual < 0 or self.reajuste_percentual > 100):
            errors.append("Percentual de reajuste deve estar entre 0 e 100")
        
        if self.multa_atraso_percentual and (self.multa_atraso_percentual < 0 or self.multa_atraso_percentual > 100):
            errors.append("Percentual de multa por atraso deve estar entre 0 e 100")
        
        if self.prazo_pagamento and self.prazo_pagamento <= 0:
            errors.append("Prazo de pagamento deve ser maior que zero")
        
        return errors

