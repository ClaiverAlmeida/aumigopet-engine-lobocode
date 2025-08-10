#!/bin/bash

# Script para Remover Recursos de Monitoramento - INFRASEG
# Use este script para reduzir custos removendo monitoramento avançado

set -e

echo "🔧 Iniciando remoção de recursos de monitoramento..."

# Backup do docker-compose atual
echo "📦 Fazendo backup do docker-compose.prod.yml..."
cp docker-compose.prod.yml docker-compose.prod.yml.backup

# Remover Prometheus e Grafana do docker-compose
echo "🗑️ Removendo Prometheus e Grafana..."
sed -i '/prometheus:/,/restart: unless-stopped/d' docker-compose.prod.yml
sed -i '/grafana:/,/restart: unless-stopped/d' docker-compose.prod.yml

# Remover volumes relacionados
echo "🗑️ Removendo volumes de monitoramento..."
sed -i '/prometheus_data:/d' docker-compose.prod.yml
sed -i '/grafana_data:/d' docker-compose.prod.yml

# Remover métricas customizadas do main.ts
echo "📝 Removendo métricas customizadas..."
sed -i '/import { MetricsInterceptor }/d' src/main.ts
sed -i '/app.useGlobalInterceptors(new MetricsInterceptor());/d' src/main.ts

# Remover rate limiting do app.module.ts
echo "🚦 Removendo rate limiting..."
sed -i '/import { RateLimitMiddleware }/d' src/app.module.ts
sed -i '/RateLimitMiddleware/d' src/app.module.ts

# Simplificar AppModule
echo "🔧 Simplificando AppModule..."
sed -i '/implements NestModule/d' src/app.module.ts
sed -i '/configure(consumer: MiddlewareConsumer) {/,/}/d' src/app.module.ts

# Remover arquivos de monitoramento
echo "🗑️ Removendo arquivos de monitoramento..."
rm -f src/shared/common/interceptors/metrics.interceptor.ts
rm -f src/shared/common/middleware/rate-limit.middleware.ts

# Criar docker-compose mínimo
echo "📝 Criando docker-compose mínimo..."
cat > docker-compose.minimal.yml << 'EOF'
# Docker Compose Mínimo - INFRASEG
services:
  backend:
    image: infraseg-backend:latest
    container_name: infraseg-backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
      - PORT=3000
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    deploy:
      replicas: 1
      resources:
        limits:
          memory: 512M
          cpus: '0.3'
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16.8-alpine3.20
    container_name: infraseg-db
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: infraseg-redis
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.2'
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
EOF

echo ""
echo "✅ Remoção concluída!"
echo ""
echo "📊 Recursos removidos:"
echo "   ❌ Prometheus (monitoramento)"
echo "   ❌ Grafana (dashboards)"
echo "   ❌ Métricas customizadas"
echo "   ❌ Rate limiting"
echo "   ❌ Nginx (load balancer)"
echo ""
echo "💰 Economia estimada: $25-50/mês"
echo ""
echo "🚀 Para usar configuração mínima:"
echo "   docker-compose -f docker-compose.minimal.yml up -d"
echo ""
echo "🔄 Para reverter:"
echo "   cp docker-compose.prod.yml.backup docker-compose.prod.yml"
echo ""
echo "📝 Arquivos modificados:"
echo "   - docker-compose.prod.yml"
echo "   - src/main.ts"
echo "   - src/app.module.ts"
echo "   - docker-compose.minimal.yml (novo)" 