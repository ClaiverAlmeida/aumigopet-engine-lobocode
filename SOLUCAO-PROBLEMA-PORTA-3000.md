# 🔧 Solução: Exposição da Porta 3000 do Backend

## ✅ Status Atual
- ✅ Backend está rodando na porta 3000
- ✅ Container está saudável
- ✅ Porta está exposta corretamente (0.0.0.0:3000->3000/tcp)
- ✅ Aplicação responde localmente
- ✅ Aplicação responde via IP interno

## 🌐 URLs de Acesso
```
http://31.97.166.94:3000
http://31.97.166.94:3000/health
```

## 🔍 Diagnóstico Realizado

### 1. Problema Identificado
O container do backend estava rodando mas **não tinha a porta exposta** para fora do container.

### 2. Solução Aplicada
- Paramos o container antigo
- Editamos o `docker-compose.backend.yml` para incluir o mapeamento de porta
- Reiniciamos o container com a nova configuração

### 3. Configuração Atual
```yaml
# docker-compose.backend.yml
backend:
  ports:
    - '3000:3000'  # ← Esta linha foi adicionada
```

## 🚨 Se Ainda Não Conseguir Acessar Externamente

### Verificação 1: Firewall do Provedor
Muitos provedores de nuvem bloqueiam portas por padrão. Verifique:

1. **AWS**: Security Groups → Inbound Rules → Adicionar porta 3000
2. **Google Cloud**: VPC Network → Firewall → Adicionar regra para porta 3000
3. **Azure**: Network Security Groups → Inbound Security Rules
4. **DigitalOcean**: Networking → Firewalls → Adicionar regra para porta 3000
5. **Vultr**: Firewall → Adicionar regra para porta 3000

### Verificação 2: Teste de Conectividade
Execute este comando para testar:
```bash
# De fora da VPS (seu computador local)
curl http://31.97.166.94:3000/health
```

### Verificação 3: Porta Alternativa
Se a porta 3000 estiver bloqueada, podemos usar outra porta:
```bash
# Editar docker-compose.backend.yml
ports:
  - '8080:3000'  # Usar porta 8080 externamente
```

## 🛠️ Comandos Úteis

### Verificar Status
```bash
# Status dos containers
docker ps | grep infraseg-backend

# Logs do backend
docker logs infraseg-backend

# Teste de conectividade
curl http://localhost:3000/health
```

### Reiniciar Backend
```bash
# Parar e remover container
docker stop infraseg-backend
docker rm infraseg-backend

# Reiniciar com nova configuração
docker compose -f docker-compose.backend.yml up -d backend
```

### Verificar Portas
```bash
# Verificar se a porta está escutando
netstat -tlnp | grep :3000

# Testar conectividade
telnet 31.97.166.94 3000
```

## 📋 Checklist de Verificação

- [ ] Container está rodando: `docker ps | grep infraseg-backend`
- [ ] Porta está exposta: `0.0.0.0:3000->3000/tcp`
- [ ] Aplicação responde localmente: `curl localhost:3000/health`
- [ ] Aplicação responde via IP: `curl 31.97.166.94:3000/health`
- [ ] Firewall do provedor permite porta 3000
- [ ] Regras de segurança (Security Groups) configuradas

## 🆘 Próximos Passos

Se ainda não conseguir acessar:

1. **Verifique o firewall do provedor** (mais comum)
2. **Teste de outra máquina/rede**
3. **Use uma porta alternativa** (8080, 8000, etc.)
4. **Configure um proxy reverso** (nginx)
5. **Use HTTPS** se necessário

## 📞 Suporte

Se precisar de mais ajuda:
- Execute o script: `./test-connectivity.sh`
- Verifique os logs: `docker logs infraseg-backend`
- Teste de fora da VPS: `curl http://31.97.166.94:3000/health`
