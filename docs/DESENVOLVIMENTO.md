# 🛠️ Guia de Desenvolvimento - AUMIGOPET

Este documento contém todas as informações para desenvolvimento local com ferramentas extras.

## 🚀 Setup Inicial

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente de desenvolvimento
```bash
# Alternar para schema de desenvolvimento (com ERD, debug, etc)
npm run prisma:dev

# Ou usar o script completo
npm run dev:setup
```

## 📊 Ferramentas de Desenvolvimento

### **Prisma ERD (Diagrama de Entidades)**
```bash
# Gerar diagrama ERD
npm run prisma:erd

# O arquivo ERD.svg será gerado em prisma/ERD.svg
```

### **Prisma Studio**
```bash
# Abrir interface visual do banco
npm run prisma:studio
```

### **Seeds (Dados de teste)**
```bash
# Popular banco com dados de teste
npm run prisma:seed
```

### **Migrations**
```bash
# Criar nova migration
npm run prisma:migrate nome-da-migration

# Aplicar migrations
npx prisma migrate deploy
```

## 🔄 Alternando entre Schemas

### **Para Desenvolvimento (com ferramentas extras)**
```bash
npm run prisma:dev
# ou
./scripts/prisma-switch.sh dev
```

### **Para Produção (enxuto)**
```bash
npm run prisma:prod
# ou
./scripts/prisma-switch.sh prod
```

## 🐳 Docker de Desenvolvimento

### **Subir ambiente completo**
```bash
docker compose up -d
```

### **Com hot-reload**
```bash
# Backend com hot-reload
docker compose up backend

# Frontend será executado em projeto separado
```

### **Logs em tempo real**
```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f backend
```

## 🧪 Testes

### **Testes unitários**
```bash
npm run test
```

### **Testes em modo watch**
```bash
npm run test:watch
```

### **Cobertura de testes**
```bash
npm run test:cov
```

### **Testes E2E**
```bash
npm run test:e2e
```

## 🔍 Debug

### **Debug do NestJS**
```bash
npm run start:debug
```

### **Debug com Docker**
```bash
# Adicionar no docker-compose.yml
ports:
  - "9229:9229"  # Porta de debug
```

## 📝 Scripts Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run prisma:dev` | Alternar para schema de desenvolvimento |
| `npm run prisma:prod` | Alternar para schema de produção |
| `npm run prisma:erd` | Gerar diagrama ERD |
| `npm run prisma:seed` | Popular banco com dados de teste |
| `npm run prisma:studio` | Abrir Prisma Studio |
| `npm run dev:setup` | Setup completo de desenvolvimento |
| `npm run start:dev` | Rodar com hot-reload |
| `npm run start:debug` | Rodar em modo debug |

## 🗂️ Estrutura de Arquivos

```
aumigopet-engine/
├── prisma/
│   ├── schema.prisma          # Schema atual (alterna entre dev/prod)
│   ├── schema.dev.prisma      # Schema de desenvolvimento (com ERD)
│   ├── schema.prod.prisma     # Schema de produção (enxuto)
│   ├── seed.ts                # Dados de teste
│   └── ERD.svg                # Diagrama gerado (apenas em dev)
├── scripts/
│   └── prisma-switch.sh       # Script para alternar schemas
├── docker-compose.yml         # Ambiente de desenvolvimento
├── docker-compose.prod.yml    # Ambiente de produção
└── docs/
    ├── DESENVOLVIMENTO.md     # Este arquivo
    └── PRODUCAO.md           # Guia de produção
```

## ⚠️ Boas Práticas

### **Antes de commitar**
1. Alternar para schema de produção: `npm run prisma:prod`
2. Verificar se não há ferramentas de dev no código
3. Rodar testes: `npm run test`
4. Verificar linting: `npm run lint`

### **Antes de fazer deploy**
1. Garantir que está no schema de produção
2. Verificar se todas as migrations foram aplicadas
3. Testar build de produção localmente

### **Para desenvolvimento**
1. Usar schema de desenvolvimento: `npm run prisma:dev`
2. Usar hot-reload para desenvolvimento rápido
3. Usar Prisma Studio para visualizar dados
4. Usar seeds para dados de teste

## 🚨 Troubleshooting

### **Erro no Prisma ERD**
```bash
# Instalar dependências manualmente
npm install -D prisma-erd-generator puppeteer

# Gerar ERD
npx prisma generate
```

### **Schema não alternou**
```bash
# Verificar se os arquivos existem
ls -la prisma/schema*.prisma

# Forçar regeneração
npx prisma generate
```

### **Docker não reconhece mudanças**
```bash
# Rebuild da imagem
docker compose build --no-cache

# Ou restart dos containers
docker compose restart
```

## 📚 Recursos Adicionais

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Docker Documentation](https://docs.docker.com)
- [Angular Documentation](https://angular.io/docs)

## 🤝 Contribuição

1. Use sempre o schema de desenvolvimento para trabalhar
2. Teste suas mudanças localmente
3. Alternar para schema de produção antes de commitar
4. Documente mudanças importantes
5. Mantenha os testes atualizados 