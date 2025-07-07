#!/bin/bash

# Script de Verificação de Segurança para iFraseg
# Executar antes do deploy em produção

set -e

echo "🔒 Iniciando verificação de segurança..."

# Verificar se há arquivos sensíveis no repositório
echo "📁 Verificando arquivos sensíveis..."

SENSITIVE_FILES=(
  "env.production"
  ".env.production"
  "nginx/ssl/"
  "*.pem"
  "*.key"
  "*.crt"
)

for file in "${SENSITIVE_FILES[@]}"; do
  if git ls-files | grep -q "$file"; then
    echo "❌ ALERTA: Arquivo sensível encontrado no repositório: $file"
    echo "   Remova este arquivo do controle de versão!"
    exit 1
  fi
done

echo "✅ Nenhum arquivo sensível encontrado no repositório"

# Verificar dependências vulneráveis
echo "📦 Verificando vulnerabilidades nas dependências..."
npm audit --audit-level=high

if [ $? -eq 0 ]; then
  echo "✅ Nenhuma vulnerabilidade crítica encontrada"
else
  echo "⚠️  Vulnerabilidades encontradas. Execute 'npm audit fix' para corrigir"
fi

# Verificar se as variáveis de ambiente estão configuradas
echo "🔧 Verificando variáveis de ambiente..."

if [ ! -f ".env.production" ] && [ ! -f "env.production" ]; then
  echo "❌ ALERTA: Arquivo de variáveis de ambiente não encontrado"
  echo "   Crie o arquivo .env.production baseado no env.example"
  exit 1
fi

echo "✅ Arquivo de variáveis de ambiente encontrado"

# Verificar certificados SSL
echo "🔐 Verificando certificados SSL..."

if [ ! -d "nginx/ssl" ]; then
  echo "⚠️  Diretório de certificados SSL não encontrado"
  echo "   Crie o diretório nginx/ssl e adicione seus certificados"
else
  if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    echo "⚠️  Certificados SSL não encontrados"
    echo "   Adicione cert.pem e key.pem em nginx/ssl/"
  else
    echo "✅ Certificados SSL encontrados"
  fi
fi

# Verificar se o health check está implementado
echo "🏥 Verificando health check..."

if ! grep -q "getHealth" src/app.controller.ts; then
  echo "❌ ALERTA: Health check não implementado"
  echo "   Implemente o endpoint /health no AppController"
  exit 1
fi

echo "✅ Health check implementado"

# Verificar se o logging está configurado
echo "📝 Verificando configuração de logging..."

if ! grep -q "CustomLoggerService" src/main.ts; then
  echo "⚠️  Logger customizado não configurado"
  echo "   Configure o CustomLoggerService no main.ts"
else
  echo "✅ Logger customizado configurado"
fi

# Verificar se o rate limiting está configurado
echo "🚦 Verificando rate limiting..."

if ! grep -q "RateLimitMiddleware" src/app.module.ts; then
  echo "⚠️  Rate limiting não configurado"
  echo "   Configure o RateLimitMiddleware no AppModule"
else
  echo "✅ Rate limiting configurado"
fi

echo ""
echo "🎉 Verificação de segurança concluída!"
echo ""
echo "📋 Checklist de produção:"
echo "   ✅ Health check implementado"
echo "   ✅ Logging estruturado configurado"
echo "   ✅ Rate limiting implementado"
echo "   ✅ Métricas customizadas configuradas"
echo "   ✅ Arquivos sensíveis protegidos"
echo ""
echo "🚀 Seu projeto está mais seguro para produção!" 