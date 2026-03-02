"""
Storage Service para RiosF5
Suporta múltiplos backends: Local Filesystem e AWS S3

Arquivo: src/services/storage_service.py
"""

import os
import uuid
from abc import ABC, abstractmethod
from werkzeug.utils import secure_filename
from datetime import datetime
from flask import current_app
import mimetypes
from typing import Tuple, Optional


# helper ----------------------------------------------------------------

def _generate_storage_path(empresa_id: int, filename: str) -> Tuple[str, str]:
    """Retorna (rel_dir, unique_name) para o arquivo.

    Usa a convenção `<empresa>/<YYYY/MM/DD>` e gera nome único.
    """
    empresa_folder = str(empresa_id) if empresa_id else 'master'
    date_folder = datetime.utcnow().strftime('%Y/%m/%d')
    rel_dir = os.path.join('documentos', empresa_folder, date_folder)
    secure_name = secure_filename(filename)
    unique_name = f"{uuid.uuid4().hex}_{secure_name}"
    return rel_dir, unique_name


# ----------------------------------------------------------------------


class StorageError(Exception):
    """Exceção genérica para erros de armazenamento."""


class StorageBackend(ABC):
    """Interface abstrata para backends de armazenamento."""

    @abstractmethod
    def save_file(self, file_obj, empresa_id: int, filename: str) -> Tuple[str, str]:
        """
        Salva um arquivo e retorna uma tupla `(url_acesso, caminho_interno)`.
        `url_acesso` pode ser local (endpoint) ou pré‑assinada do S3.
        `caminho_interno` é a chave/relativo que será gravado no banco.
        """
        raise NotImplementedError

    @abstractmethod
    def delete_file(self, internal_path: str) -> bool:
        """
        Deleta um arquivo armazenado.
        Deve retornar `True` se o arquivo era válido e foi removido.
        """
        raise NotImplementedError

    @abstractmethod
    def get_file_url(self, internal_path: str) -> str:
        """
        Retorna URL acessível publicamente para o arquivo.
        """
        raise NotImplementedError

    @abstractmethod
    def file_exists(self, internal_path: str) -> bool:
        """
        Verifica se arquivo existe no backend.
        """
        raise NotImplementedError


class LocalStorageBackend(StorageBackend):
    """Armazenamento em disco local.

    Os arquivos são organizados em `<base_folder>/documentos/<empresa>/<YYYY/MM/DD>`.
    """

    def __init__(self):
        self.base_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        if not os.path.isabs(self.base_folder):
            # converte para absoluto em relação ao app root para evitar confusão
            self.base_folder = os.path.abspath(os.path.join(current_app.root_path, self.base_folder))
        current_app.logger.debug(f"LocalStorageBackend base_folder={self.base_folder}")


    def save_file(self, file_obj, empresa_id: int, filename: str) -> Tuple[str, str]:
        """Salva arquivo localmente e retorna `(public_url, internal_path)`.

        O método usa `_make_rel_path` para calcular os diretórios e nome do
        arquivo. Garante que o diretório exista e trata falhas com log.
        """
        rel_dir, unique_name = _generate_storage_path(empresa_id, filename)
        try:
            full_dir = os.path.join(self.base_folder, rel_dir)
            os.makedirs(full_dir, exist_ok=True)

            file_path = os.path.join(full_dir, unique_name)
            file_obj.save(file_path)

            internal_path = os.path.join(rel_dir, unique_name).replace('\\', '/')
            public_url = f"/documents/{internal_path}"
            current_app.logger.debug(f"Arquivo salvo local: {file_path}")
            return public_url, internal_path
        except Exception as e:
            msg = f"Erro ao salvar arquivo localmente: {e}"
            current_app.logger.error(msg)
            raise StorageError(msg)

    def delete_file(self, internal_path: str) -> bool:
        """Deleta arquivo local.

        Retorna True se o arquivo existia e foi removido.
        """
        try:
            file_path = os.path.join(self.base_folder, internal_path)
            if os.path.exists(file_path):
                os.remove(file_path)
                current_app.logger.debug(f"Arquivo removido local: {file_path}")
                return True
            current_app.logger.warning(f"Tentativa de deletar arquivo inexistente: {file_path}")
            return False
        except Exception as e:
            current_app.logger.error(f"Erro ao deletar arquivo: {e}")
            return False

    def get_file_url(self, internal_path: str) -> str:
        """Retorna URL para acesso via endpoint `/documents/...`"""
        return f"/documents/{internal_path}"

    def file_exists(self, internal_path: str) -> bool:
        """Verifica se arquivo existe"""
        file_path = os.path.join(self.base_folder, internal_path)
        return os.path.exists(file_path)

    def delete_file(self, internal_path: str) -> bool:
        """Deleta arquivo local"""
        try:
            file_path = os.path.join(self.base_folder, internal_path)
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            current_app.logger.error(f"Erro ao deletar arquivo: {e}")
            return False

    def get_file_url(self, internal_path: str) -> str:
        """Retorna URL para acesso via endpoint /documents/..."""
        return f"/documents/{internal_path}"

    def file_exists(self, internal_path: str) -> bool:
        """Verifica se arquivo existe"""
        file_path = os.path.join(self.base_folder, internal_path)
        return os.path.exists(file_path)


class S3StorageBackend(StorageBackend):
    """Armazenamento em AWS S3.

    Usa `boto3` e configurações `AWS_*` no `current_app.config`.
    """

    def __init__(self):
        try:
            import boto3
        except ImportError:
            raise StorageError("boto3 is required for S3 storage. Install with: pip install boto3")

        self.bucket_name = current_app.config.get('AWS_S3_BUCKET')
        if not self.bucket_name:
            raise StorageError("AWS_S3_BUCKET não configurado")
        self.region = current_app.config.get('AWS_S3_REGION', 'us-east-1')

        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=current_app.config.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=current_app.config.get('AWS_SECRET_ACCESS_KEY'),
            region_name=self.region
        )
        current_app.logger.debug("S3StorageBackend initialized for bucket %s", self.bucket_name)

    def save_file(self, file_obj, empresa_id: int, filename: str) -> Tuple[str, str]:
        """Upload para S3 e retorna `(url, chave)`.

        A URL é pré‑assinada e válida por `S3_URL_EXPIRY_DAYS` ou 7 dias.
        """
        rel_dir, unique_name = _generate_storage_path(empresa_id, filename)
        key = f"{rel_dir}/{unique_name}".replace('\\', '/')
        try:
            file_obj.seek(0)
            content_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                key,
                ExtraArgs={'ContentType': content_type}
            )
            expiry_days = current_app.config.get('S3_URL_EXPIRY_DAYS', 7)
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': key},
                ExpiresIn=expiry_days * 24 * 3600
            )
            current_app.logger.debug(f"Arquivo enviado para S3: {key}")
            return url, key
        except Exception as e:
            msg = f"Erro ao fazer upload S3: {e}"
            current_app.logger.error(msg)
            raise StorageError(msg)

    def delete_file(self, internal_path: str) -> bool:
        """Deleta objeto do S3.

        Retorna True mesmo se o objeto não existia (idempotente)."""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=internal_path)
            current_app.logger.debug(f"Objeto S3 deletado: {internal_path}")
            return True
        except Exception as e:
            current_app.logger.error(f"Erro ao deletar de S3: {e}")
            return False

    def get_file_url(self, internal_path: str) -> str:
        """Gera URL pré‑assinada para o objeto S3."""
        try:
            expiry_days = current_app.config.get('S3_URL_EXPIRY_DAYS', 7)
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': internal_path},
                ExpiresIn=expiry_days * 24 * 3600
            )
            return url
        except Exception as e:
            current_app.logger.error(f"Erro ao gerar URL S3: {e}")
            return ""

    def file_exists(self, internal_path: str) -> bool:
        """Verifica se objeto existe no S3"""
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=internal_path)
            return True
        except:
            return False


class StorageService:
    """Factory e interface principal para armazenamento"""

    _instance = None
    _backend: Optional[StorageBackend] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(StorageService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if self._backend is None:
            upload_type = current_app.config.get('UPLOAD_TYPE', 'local').lower()
            current_app.logger.debug(f"Inicializando StorageService com tipo {upload_type}")

            if upload_type == 's3':
                self._backend = S3StorageBackend()
            elif upload_type == 'local':
                self._backend = LocalStorageBackend()
            else:
                raise StorageError(f"UPLOAD_TYPE inválido: {upload_type}")

    def save_file(self, file_obj, empresa_id: int, filename: str) -> Tuple[str, str]:
        """Salva arquivo usando backend configurado"""
        return self._backend.save_file(file_obj, empresa_id, filename)

    def delete_file(self, internal_path: str) -> bool:
        """Deleta arquivo"""
        return self._backend.delete_file(internal_path)

    def get_file_url(self, internal_path: str) -> str:
        """Obtém URL de acesso"""
        return self._backend.get_file_url(internal_path)

    def file_exists(self, internal_path: str) -> bool:
        """Verifica existência"""
        return self._backend.file_exists(internal_path)


def get_storage_service() -> StorageService:
    """Helper para obter instância do serviço de armazenamento"""
    return StorageService()
