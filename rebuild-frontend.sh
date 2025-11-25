#!/bin/bash

# Script para rebuild do frontend com correções de assets
echo "🔄 Iniciando rebuild do frontend..."

# Navegar para o diretório do frontend
cd /home/ubuntu/projetos/aumigopet-app-lobocode

# Rebuild da imagem do frontend
echo "📦 Fazendo build da nova imagem do frontend..."
docker build -f Dockerfile.prod -t aumigopet-app-lobocode-frontend .

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend concluído com sucesso!"
    
    # Voltar para o diretório do engine para restart do sistema
    cd /home/ubuntu/projetos/aumigopet-engine-lobocode
    
    echo "🔄 Reiniciando containers..."
    
    # Parar containers
    docker compose -f docker/docker-compose.unified.yml down
    
    # Reiniciar containers
    docker compose -f docker/docker-compose.unified.yml up -d
    
    echo "🎉 Sistema reiniciado! Testando assets..."
    
    # Aguardar containers subirem
    sleep 10
    
    # Testar se os assets estão funcionando
    echo "🧪 Testando assets..."
    curl -I http://31.97.166.94/assets/images/card-americanexpress.svg
    echo ""
    curl -I http://31.97.166.94/assets/images/defaultProfilePicture.png
    
else
    echo "❌ Erro no build do frontend!"
    exit 1
fi
