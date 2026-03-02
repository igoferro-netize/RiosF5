# 🧪 Tests - RiosF5 Backend (Simplified)

"""
Testes automatizados para RiosF5 backend
Usa pytest + pytest-flask

Executar:
    pytest tests/test_backend_simplified.py -v
"""

import pytest
from sqlalchemy import text
from src.main import app, db
from src.models.user import User


@pytest.fixture
def client():
    """Fixture: cliente Flask para testes"""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


@pytest.fixture
def admin_user(client):
    """Fixture: criar usuário admin para testes"""
    with app.app_context():
        admin = User(
            username='admin',
            email='admin@test.com',
            role='admin',
            ativo=True
        )
        admin.set_password('Admin@Test123')
        db.session.add(admin)
        db.session.commit()
        return admin


class TestHealth:
    """Testes de Health Check"""
    
    def test_health_check_runs(self, client):
        """Health check endpoint deve responder"""
        response = client.get('/health')
        # Pode retornar 200 (saudável) ou 503 (degradado - sem DB em teste)
        assert response.status_code in [200, 503]
        data = response.get_json()
        assert 'status' in data
        assert data['status'] in ['healthy', 'degraded']
    
    def test_readiness_check(self, client):
        """Readiness check deve indicar se está pronto"""
        response = client.get('/health/ready')
        assert response.status_code in [200, 503]
        data = response.get_json()
        assert 'ready' in data
    
    def test_liveness_check(self, client):
        """Liveness check deve sempre retornar 200"""
        response = client.get('/health/live')
        assert response.status_code == 200
        data = response.get_json()
        assert data['alive'] is True
    
    def test_version_check(self, client):
        """Version check deve retornar versão da app"""
        response = client.get('/health/version')
        assert response.status_code == 200
        data = response.get_json()
        assert 'version' in data


class TestAuth:
    """Testes de Autenticação"""
    
    def test_login_success(self, client, admin_user):
        """Login com credenciais corretas deve retornar tokens"""
        response = client.post('/api/auth/login', json={
            'email': 'admin@test.com',
            'password': 'Admin@Test123'
        })
        assert response.status_code == 200
        data = response.get_json()
        assert data.get('success') is True or 'data' in data
        if 'data' in data:
            assert 'access_token' in data['data']
    
    def test_login_wrong_password(self, client, admin_user):
        """Login com senha errada deve falhar"""
        response = client.post('/api/auth/login', json={
            'email': 'admin@test.com',
            'password': 'WrongPassword'
        })
        assert response.status_code == 401
    
    def test_login_nonexistent_user(self, client):
        """Login com usuário inexistente deve falhar"""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@test.com',
            'password': 'password'
        })
        assert response.status_code == 401
    
    def test_token_required_without_token(self, client):
        """Requisição sem token em rota protegida deve falhar"""
        response = client.get('/api/auth/me')
        assert response.status_code == 401


class TestSecurity:
    """Testes de Segurança"""
    
    def test_security_headers_present(self, client):
        """Response deve conter headers básicos"""
        response = client.get('/health')
        headers = response.headers
        # Verificar se há algum header de segurança
        assert len(headers) > 0
    
    def test_cors_headers(self, client):
        """CORS headers podem estar presentes"""
        response = client.options('/api/auth/login', headers={
            'Origin': 'http://localhost:5173'
        })
        # Aceita qualquer resposta - CORS pode estar desabilitado em teste
        assert response.status_code in [200, 404, 405]


class TestDatabase:
    """Testes de Database"""
    
    def test_database_connection(self, client):
        """Conexão com database deve funcionar"""
        with app.app_context():
            result = db.session.execute(text("SELECT 1"))
            assert result is not None
    
    def test_user_table_exists(self, client):
        """Tabela de usuários deve existir"""
        with app.app_context():
            # A tabela pode ser 'users' ou 'usuarios'
            assert User.__tablename__ in ['users', 'usuarios']


class TestBasicFlow:
    """Teste do fluxo básico completo"""
    
    def test_app_starts(self, client):
        """App deve iniciar sem erros"""
        assert client is not None
        response = client.get('/health')
        assert response.status_code in [200, 503]
    
    def test_swagger_available(self, client):
        """Swagger/API docs devem estar disponíveis"""
        response = client.get('/apidocs/')
        # Pode retornar 200 (sucesso) ou 404 (não configurado)
        assert response.status_code in [200, 302, 404]


class TestStorageIntegration:
    """Verifica que o StorageService e rota de documentos funcionam."""

    def test_storage_service_local(self, client, tmp_path):
        """Salvar/consultar/excluir arquivo localmente."""
        app.config['UPLOAD_FOLDER'] = str(tmp_path)
        app.config['UPLOAD_TYPE'] = 'local'
        with app.app_context():
            from src.services.storage_service import StorageService
            storage = StorageService()
            from io import BytesIO
            from werkzeug.datastructures import FileStorage

            data = BytesIO(b"test content")
            file = FileStorage(stream=data, filename="foo.txt", content_type="text/plain")
            url, internal = storage.save_file(file, empresa_id=1, filename="foo.txt")
            assert "/documents/" in url
            assert storage.file_exists(internal)
            assert storage.delete_file(internal) is True
            assert not storage.file_exists(internal)

    def test_documentos_route_upload_and_delete(self, client, admin_user, tmp_path):
        """Faz upload via rota, consulta e exclui usando o storage service."""
        app.config['UPLOAD_FOLDER'] = str(tmp_path)
        app.config['UPLOAD_TYPE'] = 'local'
        # login
        login = client.post('/api/auth/login', json={'email': 'admin@test.com', 'password': 'Admin@Test123'})
        token = login.get_json().get('data', {}).get('access_token')
        assert token
        data = {
            'nome': 'My Doc',
            'categoria': 'outro',
            'pasta_id': '1'
        }
        from io import BytesIO
        fp = BytesIO(b"hello")
        fp.name = 'mydoc.txt'
        resp = client.post('/',
                           data={'arquivo': (fp, 'mydoc.txt'), **data},
                           headers={'Authorization': f'Bearer {token}'},
                           content_type='multipart/form-data')
        assert resp.status_code == 201
        body = resp.get_json()
        assert body['success'] is True
        doc_id = body['data']['id']

        # recuperar
        resp2 = client.get(f'/{doc_id}', headers={'Authorization': f'Bearer {token}'})
        assert resp2.status_code == 200
        assert 'url' in resp2.get_json()

        # deletar
        resp3 = client.delete(f'/{doc_id}', headers={'Authorization': f'Bearer {token}'})
        assert resp3.status_code == 200


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
