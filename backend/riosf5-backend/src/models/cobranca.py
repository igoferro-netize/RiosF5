"""
Modelo de Cobrança e Controle Financeiro
Arquivo: backend/src/models/cobranca.py
"""

from datetime import datetime, timedelta
from src.models.user import db

class Contrato(db.Model):
    __tablename__ = 'contratos'
    
    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    
    # Dados do contrato
    valor_mensal = db.Column(db.Float, nullable=False, default=0.0)
    quantidade_usuarios = db.Column(db.Integer, nullable=False, default=1)
    duracao_meses = db.Column(db.Integer, nullable=False, default=12)
    
    # Vencimento e controle
    dia_vencimento = db.Column(db.Integer, nullable=False, default=10)  # Dia do mês
    data_inicio = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    data_fim = db.Column(db.Date, nullable=True)
    
    # Status
    status = db.Column(db.String(20), default='ativo')  # ativo, bloqueado, cancelado
    ativo = db.Column(db.Boolean, default=True)
    
    # Timestamps
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    empresa = db.relationship('Empresa', backref='contratos', lazy=True)
    faturas = db.relationship('Fatura', backref='contrato', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Contrato {self.id} - Empresa {self.empresa_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'empresa_id': self.empresa_id,
            'valor_mensal': self.valor_mensal,
            'quantidade_usuarios': self.quantidade_usuarios,
            'duracao_meses': self.duracao_meses,
            'dia_vencimento': self.dia_vencimento,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'status': self.status,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }
    
    @staticmethod
    def calcular_vencimento_util(ano, mes, dia):
        """Calcula o próximo dia útil caso o vencimento caia em fim de semana"""
        from calendar import monthrange
        
        # Ajustar se dia não existir no mês
        ultimo_dia = monthrange(ano, mes)[1]
        if dia > ultimo_dia:
            dia = ultimo_dia
        
        data = datetime(ano, mes, dia).date()
        
        # Se for sábado (5) ou domingo (6), avança para segunda
        while data.weekday() >= 5:
            data += timedelta(days=1)
        
        return data


class Fatura(db.Model):
    __tablename__ = 'faturas'
    
    id = db.Column(db.Integer, primary_key=True)
    contrato_id = db.Column(db.Integer, db.ForeignKey('contratos.id'), nullable=False)
    
    # Dados da fatura
    valor = db.Column(db.Float, nullable=False)
    data_vencimento = db.Column(db.Date, nullable=False)
    data_pagamento = db.Column(db.Date, nullable=True)
    
    # Status
    status = db.Column(db.String(20), default='pendente')  # pendente, pago, atrasado, cancelado
    dias_atraso = db.Column(db.Integer, default=0)
    
    # Notificações
    notificacao_enviada = db.Column(db.Boolean, default=False)
    data_notificacao = db.Column(db.DateTime, nullable=True)
    
    # Timestamps
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Fatura {self.id} - Venc: {self.data_vencimento}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'contrato_id': self.contrato_id,
            'valor': self.valor,
            'data_vencimento': self.data_vencimento.isoformat() if self.data_vencimento else None,
            'data_pagamento': self.data_pagamento.isoformat() if self.data_pagamento else None,
            'status': self.status,
            'dias_atraso': self.dias_atraso,
            'notificacao_enviada': self.notificacao_enviada,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }
    
    def verificar_atraso(self):
        """Verifica e atualiza status de atraso"""
        if self.status == 'pago':
            return False
        
        hoje = datetime.utcnow().date()
        if hoje > self.data_vencimento:
            self.dias_atraso = (hoje - self.data_vencimento).days
            self.status = 'atrasado'
            return True
        return False
    
    def marcar_como_pago(self):
        """Marca fatura como paga"""
        self.status = 'pago'
        self.data_pagamento = datetime.utcnow().date()
        self.dias_atraso = 0
