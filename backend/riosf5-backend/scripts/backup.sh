#!/bin/bash
# 🗄️ Script de Backup Automático - RiosF5 Backend
# Localização: backend/riosf5-backend/scripts/backup.sh
# Uso: ./backup.sh ou agendado via cron

set -e  # Exit on error

# Configuração
BACKUP_DIR="${BACKUP_DIR:-.}/backups"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-riosf5}"
DB_USER="${DB_USER:-postgres}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🗄️ [$(date)] Iniciando backup de banco de dados..."

# 1. Backup do PostgreSQL
DB_BACKUP="$BACKUP_DIR/db_${DB_NAME}_${TIMESTAMP}.sql.gz"
echo "📦 Fazendo backup do PostgreSQL para: $DB_BACKUP"

pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-password \
  2>/dev/null | gzip > "$DB_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Backup do banco concluído: $(ls -lh "$DB_BACKUP" | awk '{print $5}')"
else
    echo "❌ Erro ao fazer backup do banco!"
    exit 1
fi

# 2. Backup de arquivos de upload (se existir)
if [ -d "./uploads" ]; then
    UPLOAD_BACKUP="$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz"
    echo "📦 Fazendo backup dos uploads para: $UPLOAD_BACKUP"
    tar -czf "$UPLOAD_BACKUP" ./uploads 2>/dev/null
    echo "✅ Backup de uploads concluído: $(ls -lh "$UPLOAD_BACKUP" | awk '{print $5}')"
fi

# 3. Backup de logs
if [ -d "./logs" ]; then
    LOG_BACKUP="$BACKUP_DIR/logs_${TIMESTAMP}.tar.gz"
    echo "📦 Fazendo backup dos logs para: $LOG_BACKUP"
    tar -czf "$LOG_BACKUP" ./logs 2>/dev/null
    echo "✅ Backup de logs concluído: $(ls -lh "$LOG_BACKUP" | awk '{print $5}')"
fi

# 4. Upload para AWS S3 (opcional)
if command -v aws &> /dev/null; then
    S3_BUCKET="${S3_BUCKET:-}"
    if [ ! -z "$S3_BUCKET" ]; then
        echo "☁️ Fazendo upload para S3: s3://$S3_BUCKET/backups/"
        
        # Upload com metadados
        aws s3 cp "$DB_BACKUP" "s3://$S3_BUCKET/backups/" \
            --metadata "timestamp=$TIMESTAMP,database=$DB_NAME" \
            --storage-class GLACIER_IR \
            2>/dev/null && echo "✅ Upload S3 concluído"
    fi
else
    echo "⚠️ AWS CLI não disponível (skipping S3 upload)"
fi

# 5. Limpeza de backups antigos
echo "🧹 Limpando backups com mais de $RETENTION_DAYS dias..."
find "$BACKUP_DIR" -maxdepth 1 -type f -mtime +$RETENTION_DAYS -delete
echo "✅ Limpeza concluída"

# 6. Relatório
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO DO BACKUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Data: $(date -u +'%Y-%m-%d %H:%M:%S UTC')"
echo "Banco: $DB_NAME"
echo "Diretório: $BACKUP_DIR"
echo "Arquivos de backup:"
ls -lh "$BACKUP_DIR" | tail -n +2 | awk '{print "  " $9 " (" $5 ")"}'
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "✅ Backup completo!"
