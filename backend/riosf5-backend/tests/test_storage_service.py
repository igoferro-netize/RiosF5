# 🧪 Unit tests para o StorageService

"""Verifica os backends local e S3 (mockado) do serviço de armazenamento."""

import os
from io import BytesIO
import pytest

from src.main import app
from src.services.storage_service import StorageService, get_storage_service, StorageError
from werkzeug.datastructures import FileStorage


@pytest.fixture
def local_storage(tmp_path):
    """Configura o app para usar storage local em um diretório temporário."""
    app.config['UPLOAD_FOLDER'] = str(tmp_path)
    app.config['UPLOAD_TYPE'] = 'local'
    with app.app_context():
        yield get_storage_service()


def test_local_save_and_delete(local_storage):
    storage = local_storage
    data = BytesIO(b"hello world")
    file = FileStorage(stream=data, filename="foo.txt", content_type="text/plain")

    url, internal = storage.save_file(file, empresa_id=123, filename="foo.txt")
    assert "/documents/" in url
    assert storage.file_exists(internal)
    # arquivo físico deve existir
    path = os.path.join(app.config['UPLOAD_FOLDER'], internal)
    assert os.path.exists(path)

    # obter url pelo método
    assert storage.get_file_url(internal) == url

    assert storage.delete_file(internal) is True
    assert not storage.file_exists(internal)
    # remoção idempotente
    assert storage.delete_file(internal) is False


def test_invalid_upload_type():
    # singleton pode ter sido criado por outro teste, zera para forçar construtor
    StorageService._instance = None
    app.config['UPLOAD_TYPE'] = 'invalid'
    with app.app_context():
        with pytest.raises(StorageError):
            StorageService()


class DummyS3Client:
    def __init__(self, *args, **kwargs):
        self.objects = {}

    def upload_fileobj(self, file_obj, bucket, key, ExtraArgs=None):
        file_obj.seek(0)
        self.objects[key] = file_obj.read()

    def generate_presigned_url(self, ClientMethod, Params, ExpiresIn=None):
        return f"https://mock-s3/{Params['Key']}"

    def delete_object(self, Bucket, Key):
        self.objects.pop(Key, None)

    def head_object(self, Bucket, Key):
        if Key not in self.objects:
            raise Exception("Not found")
        return {'ContentLength': len(self.objects[Key])}


@pytest.fixture
def s3_storage(monkeypatch):
    """Configura app para usar storage S3 com cliente mockado."""
    app.config['UPLOAD_TYPE'] = 's3'
    app.config['AWS_S3_BUCKET'] = 'test-bucket'

    def fake_client(service_name, **kwargs):
        assert service_name == 's3'
        return DummyS3Client()

    monkeypatch.setattr('boto3.client', fake_client)
    with app.app_context():
        yield get_storage_service()


def test_s3_save_and_url(s3_storage):
    storage = s3_storage
    data = BytesIO(b"data123")
    file = FileStorage(stream=data, filename="abc.pdf", content_type="application/pdf")

    url, key = storage.save_file(file, empresa_id=77, filename="abc.pdf")
    assert key.startswith('documentos/77/')
    assert url.startswith('https://mock-s3/')
    # arquivo existe segundo cliente
    assert storage.file_exists(key)
    generated = storage.get_file_url(key)
    assert generated.startswith('https://mock-s3/')
    assert storage.delete_file(key) is True

