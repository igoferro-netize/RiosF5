# 🔒 Guia de Ativação de HTTPS em Produção
# Arquivo: backend/riosf5-backend/HTTPS_PRODUCTION_SETUP.md

## 📋 Pré-requisitos

1. **Certificado SSL/TLS**
   - Let's Encrypt (recomendado, gratuito)
   - AWS ACM, Cloudflare, ou fornecedor

2. **Domínio configurado**
   - DNS apontando para seu servidor
   - Exemplos: `api.example.com`, `backend.riosf5.com`

3. **Firewall aberto**
   - Porta 80 (para Let's Encrypt)
   - Porta 443 (HTTPS)

---

## 🔐 Opção 1: Let's Encrypt com Certbot (Recomendado)

### Instalação
```bash
# Ubuntu/Debian
sudo apt-get install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Gerar Certificado
```bash
# Standalone (sem web server existente)
sudo certbot certonly --standalone -d api.example.com -d www.api.example.com

# Com nginx existente
sudo certbot certonly --webroot -w /var/www/html -d api.example.com

# Resultado:
# Certificate: /etc/letsencrypt/live/api.example.com/fullchain.pem
# Private Key: /etc/letsencrypt/live/api.example.com/privkey.pem
```

### Renovação Automática
```bash
# Adicionar ao cron
sudo crontab -e

# Adicionar linha:
0 0 1 * * certbot renew --quiet && systemctl restart gunicorn
```

---

## 🚀 Opção 2: Gunicorn com SSL

### Configurar em produção

**1. Copiar certificados**
```bash
sudo cp /etc/letsencrypt/live/api.example.com/fullchain.pem /etc/riosf5/ssl/
sudo cp /etc/letsencrypt/live/api.example.com/privkey.pem /etc/riosf5/ssl/
sudo chmod 600 /etc/riosf5/ssl/privkey.pem
```

**2. Atualizar arquivo de configuração (src/main.py)**

```python
# src/main.py - Para ativar HTTPS em produção

import os
from flask import redirect, request

@app.route('/', methods=['GET', 'HEAD'])
def redirect_to_https():
    """Redirect HTTP to HTTPS in production"""
    if os.getenv('ENVIRONMENT') == 'production':
        if not request.is_secure:
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)
        
        # HSTS Header - force HTTPS for 1 year
        response = make_response()
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        return response, 200
    return '', 204
```

**3. Comando para rodar Gunicorn com SSL**

```bash
# Rodar com SSL
gunicorn \
    --certfile=/etc/riosf5/ssl/fullchain.pem \
    --keyfile=/etc/riosf5/ssl/privkey.pem \
    --bind 0.0.0.0:443 \
    --workers 4 \
    --worker-class sync \
    --timeout 30 \
    --access-logfile /var/log/gunicorn/access.log \
    --error-logfile /var/log/gunicorn/error.log \
    src.main:app
```

---

## 🌐 Opção 3: Nginx como Reverse Proxy (Recomendado)

### Configuração Nginx

**Arquivo: `/etc/nginx/sites-available/api.example.com`**

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name api.example.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.example.com;
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compression
    gzip on;
    gzip_types text/plain application/json;
    gzip_min_length 1000;
    
    # Upload size limit
    client_max_body_size 100M;
    
    # Backend Proxy
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        access_log off;
    }
}
```

### Habilitar config Nginx
```bash
sudo ln -s /etc/nginx/sites-available/api.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ✅ Verificação de HTTPS

### Teste 1: Certificado válido
```bash
# Deve retornar "subject=..." com seu domínio
openssl s_client -connect api.example.com:443 -servername api.example.com
```

### Teste 2: Headers de segurança
```bash
curl -I https://api.example.com/health

# Resultado esperado:
# Strict-Transport-Security: max-age=31536000
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
```

### Teste 3: Redirect HTTP → HTTPS
```bash
curl -L http://api.example.com/health
# Deve fazer redirect via 301 para HTTPS
```

### Teste 4: SSL Labs
Acesse: https://www.ssllabs.com/ssltest/analyze.html?d=api.example.com
- Objetivo: Grade A ou A+

---

## 🔑 Configuração em .env.production

```bash
# src/main.py lerá essas variáveis
ENFORCE_HTTPS=True
ENVIRONMENT=production
HSTS_ENABLED=True
SSL_CERT_FILE=/etc/letsencrypt/live/api.example.com/fullchain.pem
SSL_KEY_FILE=/etc/letsencrypt/live/api.example.com/privkey.pem
```

---

## 📋 Checklist Final

- [ ] Domínio registrado e DNS configurado
- [ ] Certificado SSL obtido (Let's Encrypt ou outro)
- [ ] Nginx/Gunicorn configurado com SSL
- [ ] HSTS headers ativados
- [ ] HTTP → HTTPS redirect funciona
- [ ] Certificado valida em SSL Labs (Grade A+)
- [ ] Renovação automática configurada
- [ ] Firewall abre porta 443
- [ ] Monitoramento de certificado expirado
- [ ] Backup de chaves privadas (seguro!)

---

**Status**: ⚠️ Implement antes de produção  
**Prioridade**: 🔴 CRÍTICA

