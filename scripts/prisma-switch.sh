#!/bin/bash

# Script para alternar entre schemas do Prisma (dev/prod)
# Uso: ./scripts/prisma-switch.sh [dev|prod]

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

# Verificar argumento
if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
    error "Uso: $0 {dev|prod}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev  - Usar schema de desenvolvimento (com ERD, debug, etc)"
    echo "  prod - Usar schema de produção (enxuto, sem ferramentas extras)"
    exit 1
fi

MODE=$1
SCHEMA_FILE="prisma/schema.prisma"
DEV_SCHEMA="prisma/schema.dev.prisma"
PROD_SCHEMA="prisma/schema.prod.prisma"

# Criar schema de produção se não existir
if [ ! -f "$PROD_SCHEMA" ]; then
    log "Criando schema de produção..."
    cp "$SCHEMA_FILE" "$PROD_SCHEMA"
fi

if [ "$MODE" = "dev" ]; then
    log "Alternando para schema de DESENVOLVIMENTO..."
    
    # Fazer backup do schema atual
    cp "$SCHEMA_FILE" "$SCHEMA_FILE.backup"
    
    # Copiar schema de desenvolvimento
    cp "$DEV_SCHEMA" "$SCHEMA_FILE"
    
    # Instalar dependências de desenvolvimento se necessário
    if ! npm list prisma-erd-generator >/dev/null 2>&1; then
        warning "Instalando dependências de desenvolvimento..."
        npm install -D prisma-erd-generator puppeteer
    fi
    
    log "✅ Schema de desenvolvimento ativado"
    log "💡 Agora você pode gerar ERD: npx prisma generate"
    
elif [ "$MODE" = "prod" ]; then
    log "Alternando para schema de PRODUÇÃO..."
    
    # Fazer backup do schema atual
    cp "$SCHEMA_FILE" "$SCHEMA_FILE.backup"
    
    # Copiar schema de produção
    cp "$PROD_SCHEMA" "$SCHEMA_FILE"
    
    log "✅ Schema de produção ativado"
    log "💡 Schema enxuto, pronto para build de produção"
fi

# Gerar cliente Prisma
log "Gerando cliente Prisma..."
npx prisma generate

log "✅ Pronto! Schema $MODE ativado com sucesso" 