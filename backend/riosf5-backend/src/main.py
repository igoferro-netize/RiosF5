import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

from src.models.user import db
from src.models.agenda import AgendaEvento
# Importar todos os modelos para garantir que o SQLAlchemy os conheça
from src.models.empresa import Empresa
from src.models.fornecedor import Fornecedor
from src.models.pasta import Pasta
from src.models.documento import Documento
from src.models.treinamento import Treinamento
from src.models.atividade import RastreamentoAtividade
from src.models.auxiliares import AprovacaoDocumento, Notificacao, Compartilhamento
from src.models.cobranca import Contrato, Fatura
from src.models.perfil import Perfil
from src.models.log import Log

from src.routes.auth import auth_bp
from src.routes.user import user_bp
from src.routes.empresa import empresa_bp
from src.routes.fornecedores import fornecedores_bp
from src.routes.treinamento import treinamento_bp
from src.routes.agenda import agenda_bp
from src.routes.cobranca import cobranca_bp
from src.routes.perfil import perfil_bp
from src.routes.log import log_bp
from src.routes.documentos import documentos_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configurações
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'asdf#FGSgvasgf$5$WGT-CHANGE-IN-PRODUCTION')
db_path = os.path.join(os.path.dirname(__file__), 'database')
os.makedirs(db_path, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f"sqlite:///{os.path.join(db_path, 'app.db')}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

# CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
CORS(app, resources={
    r"/api/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Registrar Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(empresa_bp, url_prefix='/api')
app.register_blueprint(fornecedores_bp, url_prefix='/api')
app.register_blueprint(treinamento_bp, url_prefix='/api')
app.register_blueprint(agenda_bp, url_prefix='/api')
app.register_blueprint(cobranca_bp, url_prefix='/api')
app.register_blueprint(perfil_bp, url_prefix='/api')
app.register_blueprint(log_bp, url_prefix='/api')
app.register_blueprint(documentos_bp, url_prefix='/api/documentos')

# Inicializar banco de dados
db.init_app(app)

def setup_database():
    from sqlalchemy import text
    with app.app_context():
        db.create_all()

        # Tentar garantir colunas novas em aprovacoes_documento (ALTER TABLE, ignorando erros se já existirem)
        def ensure_aprovacao_columns():
            alterations = [
                "ALTER TABLE aprovacoes_documento ADD COLUMN token VARCHAR(255)",
                "ALTER TABLE aprovacoes_documento ADD COLUMN ordem INTEGER DEFAULT 0",
                "ALTER TABLE aprovacoes_documento ADD COLUMN assinatura TEXT",
                "ALTER TABLE aprovacoes_documento ADD COLUMN acao VARCHAR(20)",
                "ALTER TABLE aprovacoes_documento ADD COLUMN token_expiracao DATETIME",
                "ALTER TABLE aprovacoes_documento ADD COLUMN email_enviado BOOLEAN DEFAULT 0"
            ]
            for sql in alterations:
                try:
                    db.session.execute(text(sql))
                    db.session.commit()
                except Exception:
                    db.session.rollback()

        ensure_aprovacao_columns()
        
        # Criar usuário master padrão se não existir
        from src.models.user import User
        master = User.query.filter_by(email='master@riosf5.com').first()
        if not master:
            master = User(
                username='master',
                email='master@riosf5.com',
                nome='Master RiosF5',
                role='master',
                ativo=True
            )
            master.set_password('master123')
            db.session.add(master)
            db.session.commit()
            print('✅ Usuário master criado: master@riosf5.com / master123')
        else:
            print('ℹ️  Usuário master já existe')
        
        # Criar usuário admin padrão se não existir
        admin = User.query.filter_by(email='admin@riosf5.com').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@riosf5.com',
                nome='Administrador RiosF5',
                role='admin',
                ativo=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('✅ Usuário admin criado: admin@riosf5.com / admin123')
        else:
            print('ℹ️  Usuário admin já existe')

# Apenas configurar o banco se não estiver em modo de teste
if not app.config.get('TESTING'):
    setup_database()

# Rotas do frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print('='*60)
    print('🚀 RiosF5 Backend v2.2.0 - Sistema Profissional')
    print('='*60)
    print(f'📡 Servidor rodando em: http://localhost:{port}')
    print(f'🔧 Debug mode: {debug}')
    print(f'🔐 JWT Secret configurado: {"Sim" if os.getenv("JWT_SECRET") else "Não (usando padrão)"}')
    print('='*60)
    print('\n👤 Credenciais de acesso:')
    print('   MASTER: master@riosf5.com / master123')
    print('   ADMIN:  admin@riosf5.com  / admin123')
    print('='*60)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
