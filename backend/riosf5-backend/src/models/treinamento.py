from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Treinamento(db.Model):
    __tablename__ = 'treinamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text)
    instrutor = db.Column(db.String(100))
    assunto = db.Column(db.String(100))
    
    # Arquivo de vídeo
    arquivo_video = db.Column(db.String(255))  # Caminho do arquivo
    duracao_video = db.Column(db.Integer)  # Duração em segundos
    thumbnail = db.Column(db.String(255))  # Imagem de capa
    
    # Relacionamento com empresa
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
    
    # Regras de aproveitamento
    tempo_minimo_visualizacao = db.Column(db.Integer, default=80)  # Porcentagem mínima
    reconhecimento_facial_obrigatorio = db.Column(db.Boolean, default=True)
    tolerancia_ausencia = db.Column(db.Integer, default=30)  # Segundos de tolerância
    
    # Configurações de certificado
    gerar_certificado = db.Column(db.Boolean, default=True)
    template_certificado = db.Column(db.String(255))
    
    # Materiais de apoio
    materiais_apoio = db.Column(db.Text)  # JSON com lista de arquivos
    
    # Controle
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    progresso_usuarios = db.relationship('ProgressoTreinamento', backref='treinamento_rel', lazy=True)
    
    def __repr__(self):
        return f'<Treinamento {self.titulo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'instrutor': self.instrutor,
            'assunto': self.assunto,
            'arquivo_video': self.arquivo_video,
            'duracao_video': self.duracao_video,
            'thumbnail': self.thumbnail,
            'empresa_id': self.empresa_id,
            'tempo_minimo_visualizacao': self.tempo_minimo_visualizacao,
            'reconhecimento_facial_obrigatorio': self.reconhecimento_facial_obrigatorio,
            'tolerancia_ausencia': self.tolerancia_ausencia,
            'gerar_certificado': self.gerar_certificado,
            'template_certificado': self.template_certificado,
            'materiais_apoio': self.materiais_apoio,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

class ProgressoTreinamento(db.Model):
    __tablename__ = 'progresso_treinamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    treinamento_id = db.Column(db.Integer, db.ForeignKey('treinamentos.id'), nullable=False)
    
    # Progresso de visualização
    tempo_assistido = db.Column(db.Integer, default=0)  # Segundos assistidos
    porcentagem_concluida = db.Column(db.Float, default=0.0)
    
    # Dados de reconhecimento facial
    tempo_com_presenca = db.Column(db.Integer, default=0)  # Segundos com presença detectada
    ausencias_detectadas = db.Column(db.Integer, default=0)
    
    # Dados de rastreamento ocular
    tempo_olhando_tela = db.Column(db.Integer, default=0)  # Segundos olhando para a tela
    score_atencao_medio = db.Column(db.Float, default=0.0)  # Score médio de atenção (0-100)
    pausas_por_desatencao = db.Column(db.Integer, default=0)  # Pausas automáticas por desatenção
    
    # Status
    status = db.Column(db.String(20), default='em_andamento')  # em_andamento, concluido, reprovado
    data_inicio = db.Column(db.DateTime, default=datetime.utcnow)
    data_conclusao = db.Column(db.DateTime)
    
    # Certificado
    certificado_gerado = db.Column(db.Boolean, default=False)
    arquivo_certificado = db.Column(db.String(255))
    
    # Relacionamentos
    usuario = db.relationship('User', backref='progressos_treinamento')
    treinamento = db.relationship('Treinamento', backref='progressos_usuarios')
    
    def __repr__(self):
        return f'<ProgressoTreinamento {self.usuario_id}-{self.treinamento_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'treinamento_id': self.treinamento_id,
            'tempo_assistido': self.tempo_assistido,
            'porcentagem_concluida': self.porcentagem_concluida,
            'tempo_com_presenca': self.tempo_com_presenca,
            'ausencias_detectadas': self.ausencias_detectadas,
            'tempo_olhando_tela': self.tempo_olhando_tela,
            'score_atencao_medio': self.score_atencao_medio,
            'pausas_por_desatencao': self.pausas_por_desatencao,
            'status': self.status,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'data_conclusao': self.data_conclusao.isoformat() if self.data_conclusao else None,
            'certificado_gerado': self.certificado_gerado,
            'arquivo_certificado': self.arquivo_certificado
        }
    
    def calcular_aproveitamento(self):
        """Calcula o aproveitamento baseado nas regras do treinamento"""
        if not self.treinamento:
            return False
        
        # Verificar tempo mínimo
        tempo_minimo_necessario = (self.treinamento.duracao_video * self.treinamento.tempo_minimo_visualizacao) / 100
        
        if self.tempo_assistido < tempo_minimo_necessario:
            return False
        
        # Verificar reconhecimento facial se obrigatório
        if self.treinamento.reconhecimento_facial_obrigatorio:
            tempo_presenca_minimo = tempo_minimo_necessario * 0.8  # 80% do tempo mínimo com presença
            if self.tempo_com_presenca < tempo_presenca_minimo:
                return False
        
        # Verificar rastreamento ocular - deve ter olhado para a tela pelo menos 70% do tempo assistido
        tempo_olhando_minimo = self.tempo_assistido * 0.7
        if self.tempo_olhando_tela < tempo_olhando_minimo:
            return False
            
        # Verificar score médio de atenção - deve ser pelo menos 70%
        if self.score_atencao_medio < 70.0:
            return False
        
        return True
    
    def atualizar_status(self):
        """Atualiza o status baseado no aproveitamento"""
        if self.calcular_aproveitamento():
            self.status = 'concluido'
            if not self.data_conclusao:
                self.data_conclusao = datetime.utcnow()
        else:
            self.status = 'reprovado'

