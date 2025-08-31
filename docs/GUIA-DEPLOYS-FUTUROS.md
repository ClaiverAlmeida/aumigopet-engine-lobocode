# 🚀 Guia de Deploys Futuros - Backend INFRASEG

## ✅ Configuração Atual

A **porta 3000 já está configurada permanentemente** no arquivo `docker-compose.backend.yml`. Isso significa que **não precisa configurar nada** para futuros deploys!

### 📋 Configuração Permanente
```yaml
# docker-compose.backend.yml
backend:
  ports:
    - '3000:3000'  # ← Já configurado permanentemente
```

## 🚀 Processo de Deploy para Novas Features

### Opção 1: Deploy Apenas do Backend (Recomendado)
```bash
# 1. Fazer pull das mudanças
git pull origin main

# 2. Deploy apenas do backend
./scripts/deploy-backend-only.sh
```

### Opção 2: Deploy Completo
```bash
# 1. Fazer pull das mudanças
git pull origin main

# 2. Deploy completo
./scripts/deploy.sh unified
```

### Opção 3: Deploy Manual
```bash
# 1. Fazer pull das mudanças
git pull origin main

# 2. Parar backend atual
docker stop infraseg-backend

# 3. Reconstruir e iniciar
docker compose -f docker-compose.backend.yml up -d --build backend
```

## 🔄 O Que Acontece Durante o Deploy

### ✅ Processo Automático
1. **Para o container atual** (se estiver rodando)
2. **Reconstrói a imagem** com as novas features
3. **Inicia o novo container** com a mesma configuração de porta
4. **Mantém a porta 3000 exposta** automaticamente
5. **Executa health checks** para verificar se está funcionando

### 🛡️ Segurança
- **Zero downtime**: O novo container só inicia após o anterior parar
- **Rollback automático**: Se falhar, o container anterior continua rodando
- **Health checks**: Verifica se a aplicação está respondendo

## 📊 Verificação Pós-Deploy

### Comandos de Verificação
```bash
# 1. Verificar se o container está rodando
docker ps | grep infraseg-backend

# 2. Verificar se a porta está exposta
netstat -tlnp | grep :3000

# 3. Testar health check
curl http://localhost:3000/health

# 4. Verificar logs
docker logs infraseg-backend

# 5. Teste completo
./test-connectivity.sh
```

### ✅ Checklist Pós-Deploy
- [ ] Container está rodando: `docker ps | grep infraseg-backend`
- [ ] Porta 3000 está exposta: `0.0.0.0:3000->3000/tcp`
- [ ] Health check responde: `curl localhost:3000/health`
- [ ] Logs sem erros: `docker logs infraseg-backend`
- [ ] Acesso externo funciona: `curl http://31.97.166.94:3000/health`

## 🚨 Cenários Especiais

### 🔧 Se a Porta Não Estiver Exposta
```bash
# Verificar configuração
docker compose -f docker-compose.backend.yml config | grep ports

# Se não estiver configurado, editar o arquivo
nano docker-compose.backend.yml
# Adicionar: ports: ['3000:3000']

# Reiniciar
docker compose -f docker-compose.backend.yml up -d backend
```

### 🔄 Se Precisar Mudar a Porta
```bash
# Editar docker-compose.backend.yml
ports:
  - '8080:3000'  # Mudar para porta 8080 externamente

# Reiniciar
docker compose -f docker-compose.backend.yml up -d backend
```

### 🛠️ Se Houver Problemas
```bash
# 1. Verificar logs
docker logs infraseg-backend

# 2. Verificar status
docker ps -a | grep infraseg-backend

# 3. Reiniciar forçadamente
docker stop infraseg-backend
docker rm infraseg-backend
docker compose -f docker-compose.backend.yml up -d backend

# 4. Testar conectividade
./test-connectivity.sh
```

## 📋 Scripts Disponíveis

### 🚀 Scripts de Deploy
- `./scripts/deploy.sh` - Script principal com múltiplas opções
- `./scripts/deploy-backend-only.sh` - Deploy apenas do backend
- `./scripts/deploy-unified.sh` - Deploy completo
- `./scripts/deploy-infrastructure.sh` - Deploy da infraestrutura

### 🔍 Scripts de Diagnóstico
- `./test-connectivity.sh` - Teste completo de conectividade
- `./scripts/network-manager.sh` - Gerenciar rede Docker

### 📊 Scripts de Monitoramento
- `./scripts/start-monitoring.sh` - Iniciar Prometheus/Grafana
- `./scripts/backup.sh` - Backup do banco de dados

## 🎯 Resumo para Deploys Futuros

### ✅ **NÃO PRECISA CONFIGURAR NADA**
A porta 3000 já está configurada permanentemente no `docker-compose.backend.yml`.

### 🚀 **Processo Simples**
1. `git pull origin main`
2. `./scripts/deploy-backend-only.sh`
3. Pronto! ✅

### 🔍 **Verificação Rápida**
```bash
# Teste rápido
curl http://31.97.166.94:3000/health

# Ou use o script completo
./test-connectivity.sh
```

## 📞 Suporte

Se algo der errado:
1. Execute `./test-connectivity.sh`
2. Verifique os logs: `docker logs infraseg-backend`
3. Consulte o arquivo `SOLUCAO-PROBLEMA-PORTA-3000.md`

---

**🎉 Conclusão**: A configuração da porta está **permanente e automática**. Para futuros deploys, basta executar o script de deploy e a porta 3000 continuará funcionando!
