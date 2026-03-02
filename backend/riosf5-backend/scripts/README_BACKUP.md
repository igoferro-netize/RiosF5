# Agendamento do Backup

Este arquivo descreve como agendar o script de backup `backup.sh` em um servidor Linux.

Exemplo: cron (executa diariamente às 02:30)

```bash
# editar crontab do usuário responsável
crontab -e

# adicionar linha (ajuste PATH/variáveis de ambiente conforme necessário)
30 2 * * * /bin/bash /opt/riosf5/backend/riosf5-backend/scripts/backup.sh >> /var/log/riosf5/backup.log 2>&1
```

Exemplo: systemd timer (mais robusto)

1. Criar unidade de serviço `/etc/systemd/system/riosf5-backup.service`:

```ini
[Unit]
Description=RiosF5 Backup Service

[Service]
Type=oneshot
User=riosf5
Group=riosf5
WorkingDirectory=/opt/riosf5/backend/riosf5-backend
ExecStart=/bin/bash /opt/riosf5/backend/riosf5-backend/scripts/backup.sh
```

2. Criar timer `/etc/systemd/system/riosf5-backup.timer`:

```ini
[Unit]
Description=Run RiosF5 backup daily

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

3. Habilitar e iniciar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now riosf5-backup.timer
```

Observações:
- Garanta que o usuário que executa o backup tenha permissões para acessar o banco e os arquivos.
- Configure variáveis de ambiente (DB_HOST, DB_USER, S3_BUCKET, BACKUP_DIR, RETENTION_DAYS) em um arquivo seguro ou systemd `EnvironmentFile`.
- Teste manualmente antes de agendar: `bash scripts/backup.sh`.
