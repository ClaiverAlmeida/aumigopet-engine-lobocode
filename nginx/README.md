# 🚀 Configuração Nginx - Infraseg Engine

## 📋 **Visão Geral**

Esta configuração do Nginx resolve o problema de comunicação entre frontend (Angular) e backend (NestJS) criando um **ponto único de entrada** que roteia inteligentemente as requisições.

## 🎯 **Como Funciona**

### **Roteamento Inteligente:**
- **`https://localhost`** → Serve o Angular (container frontend)
- **`https://localhost/api/*`** → Roteia para o NestJS (container backend)
- **`http://localhost:3000`** → Acesso direto ao backend
- **`http://localhost:4200`** → Acesso direto ao frontend

### **Fluxo de Requisições:**
```
Cliente → Nginx (443) → { /api/* → backend:3000 }
                      → { /* → frontend:80 }
```

## 🔧 **Configuração Principal**

### **1. Arquivo Principal: `nginx.conf`**
- **Domínio:** `localhost` (para desenvolvimento)
- **SSL:** Certificado auto-assinado
- **CORS:** Configurado para permitir comunicação front/back
- **Rate Limiting:** Proteção contra ataques

### **2. Arquivo Opcional: `api.conf`**
- **Domínio separado:** `api.appinfraseg.com.br` (para produção)
- **Acesso direto:** Para chamadas externas à API
- **Mesmo backend:** NestJS no container backend

## 🚀 **Como Implementar (FÁCIL!)**

### **Passo 1: Executar Script Automático**
```bash
# Executar o script que configura tudo automaticamente
./scripts/setup-nginx.sh
```

### **Passo 2: Verificar Status**
```bash
# Verificar se todos os serviços estão rodando
docker compose -f docker/docker-compose.unified.yml ps
```

### **Passo 3: Testar Funcionamento**
```bash
# Testar frontend
curl -k https://localhost

# Testar API
curl -k https://localhost/api/health
```

## 🐳 **Arquitetura Docker**

### **Serviços Configurados:**
- **`nginx`** - Reverse proxy (portas 80, 443)
- **`frontend`** - Angular (porta 4200)
- **`backend`** - NestJS (porta 3000)
- **`db`** - PostgreSQL (porta 5432)
- **`redis`** - Cache (porta 6379)
- **`minio`** - Armazenamento (portas 9000-9001)

### **Rede:**
- **`app-net`** - Rede Docker para comunicação entre containers

## 🧪 **Testes de Funcionamento**

### **Teste do Frontend:**
```bash
curl -k https://localhost
# Deve retornar o Angular
```

### **Teste da API:**
```bash
curl -k https://localhost/api/health
# Deve retornar status do NestJS
```

### **Teste de CORS:**
```bash
# Simular requisição do frontend
curl -H "Origin: https://localhost" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://localhost/api/auth/login
```

## 🔒 **Segurança**

### **Rate Limiting:**
- **API geral:** 30 requisições/segundo
- **Login:** 5 requisições/segundo
- **Burst:** 60 requisições

### **Headers de Segurança:**
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Referrer-Policy`

### **CORS Configurado:**
- **Origem permitida:** `https://localhost`
- **Métodos:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization, etc.
- **Credentials:** Permitidos

## 🐛 **Solução de Problemas**

### **Erro 405 Method Not Allowed:**
- ✅ **Resolvido:** Configuração de CORS e roteamento correto
- ✅ **Preflight OPTIONS:** Configurado automaticamente

### **Erro de Conexão:**
```bash
# Verificar se os containers estão rodando
docker compose -f docker/docker-compose.unified.yml ps

# Ver logs do nginx
docker compose -f docker/docker-compose.unified.yml logs nginx
```

### **Erro SSL:**
```bash
# Verificar certificados
ls -la nginx/ssl/

# Recriar certificados se necessário
rm nginx/ssl/*
./scripts/setup-nginx.sh
```

## 📊 **Monitoramento**

### **Logs:**
- **Access:** `nginx/logs/access.log`
- **Error:** `nginx/logs/error.log`
- **Formato:** JSON para fácil parsing

### **Health Checks:**
- **Backend:** `/api/health` → Status do NestJS
- **Nginx:** `/health` → Status do servidor

## 🔄 **Manutenção**

### **Atualizações:**
```bash
# Recarregar configuração
docker compose -f docker/docker-compose.unified.yml restart nginx

# Verificar sintaxe
docker exec infraseg-nginx nginx -t
```

### **Backup:**
```bash
# Fazer backup da configuração
cp nginx/nginx.conf nginx/nginx.conf.backup
```

## 📞 **Suporte**

Se encontrar problemas:
1. Execute `./scripts/setup-nginx.sh`
2. Verifique os logs: `docker compose -f docker/docker-compose.unified.yml logs nginx`
3. Teste conectividade: `curl -v localhost:3000/health`

## 🎯 **Comandos Úteis**

### **Gerenciar Serviços:**
```bash
# Iniciar tudo
docker compose -f docker/docker-compose.unified.yml up -d

# Parar tudo
docker compose -f docker/docker-compose.unified.yml down

# Ver logs
docker compose -f docker/docker-compose.unified.yml logs -f

# Reiniciar nginx
docker compose -f docker/docker-compose.unified.yml restart nginx
```

### **Verificar Status:**
```bash
# Status dos containers
docker ps

# Status da rede
docker network ls

# Logs específicos
docker logs infraseg-nginx
docker logs infraseg-backend
docker logs frontend
```

---

**🎉 Agora seu frontend e backend devem se comunicar perfeitamente através do Nginx!**

**🚀 Execute: `./scripts/setup-nginx.sh` para configurar tudo automaticamente!**
