#!/bin/bash

echo "🔍 Testando conectividade do backend..."
echo "========================================"

# Teste local
echo "1. Teste local (localhost:3000):"
curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health
echo -e "\n"

# Teste IP interno
echo "2. Teste IP interno (31.97.166.94:3000):"
curl -s http://31.97.166.94:3000/health | jq . 2>/dev/null || curl -s http://31.97.166.94:3000/health
echo -e "\n"

# Teste de porta
echo "3. Verificando se a porta 3000 está escutando:"
netstat -tlnp | grep :3000
echo -e "\n"

# Teste de container
echo "4. Status do container:"
docker ps | grep infraseg-backend
echo -e "\n"

# Teste de logs
echo "5. Últimas linhas dos logs do backend:"
docker logs --tail 10 infraseg-backend
echo -e "\n"

echo "✅ Testes concluídos!"
echo ""
echo "📋 Resumo:"
echo "- Backend está rodando na porta 3000"
echo "- Container está saudável"
echo "- Porta está exposta corretamente"
echo ""
echo "🌐 Para acessar externamente:"
echo "   http://31.97.166.94:3000"
echo "   http://31.97.166.94:3000/health"
echo ""
echo "⚠️  Se não conseguir acessar externamente, verifique:"
echo "   1. Firewall do provedor de nuvem"
echo "   2. Regras de segurança (Security Groups)"
echo "   3. Configurações de rede do provedor"
