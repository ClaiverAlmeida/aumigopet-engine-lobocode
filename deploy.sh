#!/bin/bash

# Script de Deploy para Produção
# Uso: ./deploy.sh [build|deploy|restart|logs|backup]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

# Verificar se o arquivo .env existe
if [ ! -f "env.production" ]; then
    error "Arquivo env.production não encontrado!"
fi

# Carregar variáveis de ambiente
export $(cat env.production | grep -v '^#' | xargs)

# Função para build das imagens
build_images() {
    log "Construindo imagens Docker..."
    
    # Alternar para schema de produção
    log "Configurando schema de produção..."
    ./scripts/prisma-switch.sh prod
    
    # Build do Backend
    log "Build do Backend NestJS..."
    docker build -t ifraseg-backend:latest .
    
    # Frontend será buildado em outro projeto
    log "ℹ️ Frontend será buildado em projeto separado"
    
    log "Build concluído com sucesso!"
}

# Função para deploy
deploy() {
    log "Iniciando deploy em produção..."
    
    # Verificar se as imagens existem
    if ! docker image inspect ifraseg-backend:latest >/dev/null 2>&1; then
        warning "Imagem ifraseg-backend:latest não encontrada. Executando build..."
        build_images
    fi
    

    
    # Parar containers existentes
    log "Parando containers existentes..."
    docker compose -f docker-compose.prod.yml down --remove-orphans
    
    # Subir novos containers
    log "Subindo containers de produção..."
    docker compose -f docker-compose.prod.yml up -d
    
    # Aguardar inicialização
    log "Aguardando inicialização dos serviços..."
    sleep 30
    
    # Verificar status
    log "Verificando status dos containers..."
    docker compose -f docker-compose.prod.yml ps
    
    # Health check
    log "Executando health checks..."
    check_health
    
    log "Deploy concluído com sucesso!"
}

# Função para restart
restart() {
    log "Reiniciando serviços..."
    docker compose -f docker-compose.prod.yml restart
    log "Serviços reiniciados!"
}

# Função para logs
logs() {
    log "Exibindo logs dos containers..."
    docker compose -f docker-compose.prod.yml logs -f
}

# Função para backup
backup() {
    log "Iniciando backup do banco de dados..."
    
    BACKUP_DIR="./backups"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    mkdir -p $BACKUP_DIR
    
    # Backup do PostgreSQL
    docker compose -f docker-compose.prod.yml exec -T db pg_dump -U postgres $DB_NAME > "$BACKUP_DIR/$BACKUP_FILE"
    
    # Comprimir backup
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    
    # Remover backups antigos (manter apenas 7 dias)
    find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
    
    log "Backup concluído: $BACKUP_DIR/$BACKUP_FILE.gz"
}

# Função para health check
check_health() {
    log "Verificando saúde dos serviços..."
    
    # Health check do Backend
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        log "✅ Backend está saudável"
    else
        warning "⚠️ Backend pode estar com problemas"
    fi
    

    
    # Health check do Nginx
    if curl -f http://localhost/health >/dev/null 2>&1; then
        log "✅ Nginx está saudável"
    else
        warning "⚠️ Nginx pode estar com problemas"
    fi
}

# Função para monitoramento
monitor() {
    log "Exibindo estatísticas dos containers..."
    docker stats --no-stream
}

# Função para limpeza
cleanup() {
    log "Limpando recursos não utilizados..."
    
    # Remover containers parados
    docker container prune -f
    
    # Remover imagens não utilizadas
    docker image prune -f
    
    # Remover volumes não utilizados
    docker volume prune -f
    
    # Remover redes não utilizadas
    docker network prune -f
    
    log "Limpeza concluída!"
}

# Menu principal
case "${1:-}" in
    "build")
        build_images
        ;;
    "deploy")
        deploy
        ;;
    "restart")
        restart
        ;;
    "logs")
        logs
        ;;
    "backup")
        backup
        ;;
    "health")
        check_health
        ;;
    "monitor")
        monitor
        ;;
    "cleanup")
        cleanup
        ;;
    "full")
        build_images
        deploy
        ;;
    *)
        echo "Uso: $0 {build|deploy|restart|logs|backup|health|monitor|cleanup|full}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  build   - Construir imagens Docker"
        echo "  deploy  - Fazer deploy em produção"
        echo "  restart - Reiniciar serviços"
        echo "  logs    - Exibir logs dos containers"
        echo "  backup  - Fazer backup do banco"
        echo "  health  - Verificar saúde dos serviços"
        echo "  monitor - Exibir estatísticas"
        echo "  cleanup - Limpar recursos não utilizados"
        echo "  full    - Build + Deploy completo"
        exit 1
        ;;
esac 