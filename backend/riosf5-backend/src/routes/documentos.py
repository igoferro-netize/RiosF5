from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from sqlalchemy.exc import SQLAlchemyError
from src.models.documento import Documento
from src.models.user import db
from src.routes.auth import token_required
from src.services.storage_service import get_storage_service, StorageError
import os
from datetime import datetime
import mimetypes

documentos_bp = Blueprint('documentos', __name__)

@documentos_bp.route('/', methods=['GET'])
@token_required
def get_documentos(current_user):
    """Listar todos os documentos (filtrados por empresa para usuários não-master)"""
    try:
        query = Documento.query
        if not current_user.is_master():
            # aplica filtro por empresa do usuário para evitar vazamento entre empresas
            query = query.filter(Documento.empresa_id == current_user.empresa_id)
        documentos = query.all()
        storage = get_storage_service()
        return jsonify([{
            'id': doc.id,
            'nome': doc.nome,
            'tipo': doc.tipo,
            'caminho': doc.caminho,
            'tamanho': doc.tamanho,
            'data_upload': doc.data_upload.isoformat() if doc.data_upload else None,
            'usuario_id': doc.usuario_id,
            'pasta_id': doc.pasta_id,
            'url': storage.get_file_url(doc.caminho_arquivo)
        } for doc in documentos]), 200
    except (SQLAlchemyError, ValueError, KeyError) as e:
        current_app.logger.error(f'Erro ao listar documentos: {str(e)}')
        return jsonify({'error': 'Erro ao listar documentos. Por favor, tente novamente.'}), 500

@documentos_bp.route('/', methods=['POST'])
@token_required
def upload_documento(current_user):
    """Fazer upload seguro de documento"""
    try:
        # Validar existência de arquivo
        if 'arquivo' not in request.files:
            return jsonify({'error': 'Nenhum arquivo foi enviado'}), 400
        
        arquivo = request.files['arquivo']
        if arquivo.filename == '':
            return jsonify({'error': 'Arquivo sel vazio'}), 400
        
        # Parâmetros obrigatórios
        nome = request.form.get('nome', '').strip()
        categoria = request.form.get('categoria', 'outro').strip()
        pasta_id = request.form.get('pasta_id')
        
        if not nome:
            return jsonify({'error': 'Nome do documento é obrigatório'}), 400
        if not pasta_id:
            return jsonify({'error': 'Pasta ID é obrigatório'}), 400
        
        # Validar tamanho máximo (100 MB)
        max_file_size = current_app.config.get('MAX_CONTENT_LENGTH', 100 * 1024 * 1024)
        if len(arquivo.getvalue() if hasattr(arquivo, 'getvalue') else arquivo.read()) > max_file_size:
            return jsonify({'error': 'Arquivo muito grande (máx 100MB)'}), 413
        
        # Extensões permitidas
        allowed_extensions = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'txt', 'zip'}
        filename_safe = secure_filename(arquivo.filename)
        file_ext = filename_safe.rsplit('.', 1)[1].lower() if '.' in filename_safe else ''
        
        if file_ext not in allowed_extensions:
            return jsonify({'error': f'Tipo de arquivo não permitido. Permitidos: {{", ".join(allowed_extensions)}}'}), 400
        
            # Use StorageService for actual persistence
        storage = get_storage_service()
        try:
            # compute size before sending (file_obj may be seekable)
            try:
                arquivo.stream.seek(0, os.SEEK_END)
                file_size = arquivo.stream.tell()
                arquivo.stream.seek(0)
            except Exception:
                file_size = None

            public_url, internal_path = storage.save_file(arquivo, current_user.empresa_id, filename_safe)
        except StorageError as exc:
            return jsonify({'error': f'Erro de armazenamento: {str(exc)}'}), 500

        mime_type, _ = mimetypes.guess_type(filename_safe)

        # Criar registro no banco
        documento = Documento(
            nome=nome,
            nome_arquivo=filename_safe,
            caminho_arquivo=internal_path,
            tipo_arquivo=file_ext,
            tamanho_arquivo=file_size or 0,
            categoria=categoria,
            pasta_id=int(pasta_id),
            responsavel_id=current_user.id,
            criado_por=current_user.id,
            empresa_id=current_user.empresa_id,
            data_upload=datetime.utcnow()
        )
        
        db.session.add(documento)
        db.session.commit()
        
        result_data = {
            'id': documento.id,
            'nome': documento.nome,
            'nome_arquivo': documento.nome_arquivo,
            'tamanho': documento.tamanho_arquivo,
            'tipo': file_ext,
            'data_upload': documento.data_upload.isoformat(),
            'url': public_url
        }
        return jsonify({'success': True, 'message': 'Documento enviado com sucesso', 'data': result_data}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao fazer upload: {str(e)}'}), 500

@documentos_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_documento(current_user, id):
    """Obter documento específico"""
    try:
        documento = Documento.query.get_or_404(id)
        if not current_user.is_master() and documento.empresa_id != current_user.empresa_id:
            return jsonify({'error': 'Acesso negado ao documento'}), 403
        storage = get_storage_service()
        public_link = storage.get_file_url(documento.caminho_arquivo)
        return jsonify({
            'id': documento.id,
            'nome': documento.nome,
            'tipo': documento.tipo,
            'caminho': documento.caminho,
            'tamanho': documento.tamanho,
            'data_upload': documento.data_upload.isoformat() if documento.data_upload else None,
            'usuario_id': documento.usuario_id,
            'pasta_id': documento.pasta_id,
            'url': public_link
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documentos_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_documento(current_user, id):
    """Deletar documento"""
    try:
        documento = Documento.query.get_or_404(id)
        if not current_user.is_master() and documento.empresa_id != current_user.empresa_id:
            return jsonify({'error': 'Acesso negado ao documento'}), 403
        # tentar remover do armazenamento também
        storage = get_storage_service()
        try:
            storage.delete_file(documento.caminho_arquivo)
        except Exception:
            current_app.logger.warning('Falha ao excluir arquivo no storage')
        db.session.delete(documento)
        db.session.commit()
        return jsonify({'message': 'Documento deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
