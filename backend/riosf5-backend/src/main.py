import os
import sys

from flask import Flask, send_from_directory, redirect, request
from flask_cors import CORS
from dotenv import load_dotenv
import secrets

# Carregar variáveis de ambiente
load_dotenv()

# Importar configurações de segurança
from src.config import SecurityConfig
from src.middleware import SecurityMiddleware

# Swagger/OpenAPI Documentation
from src.swagger import init_swagger

# Integração Sentry para monitoramento (Camada 6)
if SecurityConfig.SENTRY_ENABLED and SecurityConfig.SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.flask import FlaskIntegration
    sentry_sdk.init(
        dsn=SecurityConfig.SENTRY_DSN,
        integrations=[FlaskIntegration()],
        traces_sample_rate=SecurityConfig.SENTRY_TRACES_SAMPLE_RATE,
        environment=SecurityConfig.ENVIRONMENT,
    )

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
from src.routes.health import health_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Inicializar Swagger/OpenAPI
init_swagger(app)

# Configurações
# carregar ou gerar JWT secret
jwt_secret = os.getenv('JWT_SECRET')
if not jwt_secret:
    # gerar automaticamente, mas avisar que não é seguro para produção
    jwt_secret = secrets.token_urlsafe(32)
    print('⚠️ JWT_SECRET não definido; gerando um temporário (não use em produção)')
app.config['SECRET_KEY'] = jwt_secret

# Aplicar configurações de cookie/ sessão baseadas em SecurityConfig
app.config['SESSION_COOKIE_SECURE'] = SecurityConfig.SESSION_COOKIE_SECURE
app.config['SESSION_COOKIE_HTTPONLY'] = SecurityConfig.SESSION_COOKIE_HTTPONLY
app.config['SESSION_COOKIE_SAMESITE'] = SecurityConfig.SESSION_COOKIE_SAMESITE

# Talisman (forçar HTTPS/HSTS) - ativado em produção ou quando FORCE_HTTPS=1
from flask_talisman import Talisman
force_https = os.getenv('FORCE_HTTPS', 'false').lower() in ('1', 'true') or SecurityConfig.is_production()
if force_https:
    talisman_opts = {
        'content_security_policy': SecurityConfig.CSP_POLICY,
        'force_https': True,
        'force_https_permanent': True,
        'strict_transport_security': True,
        'strict_transport_security_max_age': SecurityConfig.HSTS_MAX_AGE,
        'frame_options': 'DENY'
    }
    Talisman(app, **talisman_opts)
    print('🔐 Flask-Talisman ativado (HTTPS/HSTS)')
else:
    # Não forçar HTTPS em dev/test
    Talisman(app, force_https=False, content_security_policy=None)
db_path = os.path.join(os.path.dirname(__file__), 'database')
os.makedirs(db_path, exist_ok=True)
# Convert path to use forward slashes for SQLite URI compatibility on Windows
db_file_path = os.path.join(db_path, 'app.db').replace('\\', '/')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f"sqlite:///{db_file_path}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

# segurança HTTP (XSS, clickjacking, HSTS, etc.)
# DESABILITADO para desenvolvimento; ative em produção
from flask_talisman import Talisman
# if not app.config.get('DEBUG'):
#     # Force HTTPS only in production
#     Talisman(app, force_https=True, force_https_permanent=True, strict_transport_security=True)
# else:
#     # Development mode: allow HTTP, minimal security headers
#     Talisman(app, force_https=False)

# Import limiter singleton instead of creating new instance
from src.limiter import limiter

# CORS
# origens podem ser configuradas via variável de ambiente; o valor default atende 5173 e 3000.
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')

CORS(app, resources={
    r"/api/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Initialize limiter with app
limiter.init_app(app)

# ============================================================================
# 🔐 APLICAR ARQUITETURA DE SEGURANÇA EM 6 CAMADAS
# ============================================================================
# Camada 1: Rate Limiting (já em limiter.init_app)
# Camada 2: Headers HTTP Seguros
# Camada 3: JWT + Refresh Tokens (em auth_service)
# Camada 4: Multi-tenant Isolation (em tenant_isolation)
# Camada 5: Auditoria (em audit_service)
# Camada 6: Monitoramento de Erros
SecurityMiddleware.apply_all(app)

# Registrar Blueprints
app.register_blueprint(health_bp, url_prefix='')  # Health check em rota raiz
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
    from src.models.user import User
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
        
        # Criar ou atualizar usuário master inicial se não existir
        # As credenciais DEVEM ser definidas via variáveis de ambiente;
        # não há valores padrão para evitar commit acidental de secrets
        initial_email = os.getenv('INITIAL_ADMIN_EMAIL')
        initial_pass = os.getenv('INITIAL_ADMIN_PASSWORD')
        if not initial_email or not initial_pass:
            raise RuntimeError('INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD devem estar definidas no ambiente')

        existing_master = User.query.filter_by(role='master').first()
        force = os.getenv('INITIAL_ADMIN_FORCE', 'false').lower() in ('1','true','yes')
        if not existing_master or force:
            if existing_master and force:
                existing_master.email = initial_email
                existing_master.set_password(initial_pass)
                db.session.commit()
                msg = f"⚠️ Usuário master existente sobrescrito por força de INITIAL_ADMIN_FORCE"            
            else:
                master = User(
                    username='master',
                    email=initial_email,
                    role='master',
                    ativo=True
                )
                master.set_password(initial_pass)
                db.session.add(master)
                db.session.commit()
                msg = f"⚠️ Usuário master inicial criado: {initial_email}"
            if os.getenv('PRINT_CREDENTIALS', 'false').lower() in ('1','true','yes'):
                msg += f" / senha: {initial_pass}"
            else:
                msg += " (senha padrão definida, habilite PRINT_CREDENTIALS para exibir)"
            print(msg)
        # se já existir um master e não houver force, não alteramos sua senha automaticamente

# Apenas configurar o banco se não estiver em modo de teste
if not app.config.get('TESTING'):
    setup_database()

# segurança: headers HTTP rígidos
@app.after_request
def set_security_headers(response):
    # Aplicar cabeçalhos seguros definidos em SecurityConfig
    try:
        csp = SecurityConfig.get_csp_header()
        if csp:
            response.headers['Content-Security-Policy'] = csp
    except Exception:
        # fallback simples
        response.headers['Content-Security-Policy'] = "default-src 'self'"

    for k, v in SecurityConfig.HEADERS_SECURE.items():
        response.headers[k] = v

    # HSTS apenas em produção/forçado
    if SecurityConfig.is_production() or os.getenv('FORCE_HTTPS', 'false').lower() in ('1', 'true'):
        hsts = f"max-age={SecurityConfig.HSTS_MAX_AGE}"
        if SecurityConfig.HSTS_INCLUDE_SUBDOMAINS:
            hsts += "; includeSubDomains"
        if SecurityConfig.HSTS_PRELOAD:
            hsts += "; preload"
        response.headers['Strict-Transport-Security'] = hsts

    return response


# Rotas do frontend (somente serve arquivos estáticos da pasta configurada)
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

    # por questões de segurança, credenciais padrão só são exibidas quando a variável
    # de ambiente PRINT_CREDENTIALS estiver ativa (ex: PRINT_CREDENTIALS=1).
    # em ambientes de produção essa variável não deve ser definida.
    if os.getenv('PRINT_CREDENTIALS', 'false').lower() in ('1', 'true', 'yes'):
        print('\n👤 Credenciais de acesso:')
        print('   MASTER: master@riosf5.com / master123')
        print('   ADMIN:  admin@riosf5.com  / admin123')
        print('='*60)

    app.run(host='0.0.0.0', port=port, debug=debug)
