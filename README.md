# 🧱 LoboCode Template - Backend

> Base sólida e reutilizável para todos os projetos backend da LoboCode com NestJS.

## 📌 Sobre o Projeto

O **LoboCode Template - Backend** é um projeto base desenvolvido para padronizar e acelerar o desenvolvimento de APIs backend na LoboCode, utilizando o framework NestJS 11. A estrutura proposta garante organização, manutenibilidade, testes e escalabilidade desde o início do projeto.

> 🎥 Referência: Assista ao vídeo explicativo para entender a estrutura por completo:  
> [🔗 YouTube - Estrutura Base Nest.js](https://www.youtube.com/watch?v=PHIMN85trgk)

> 📚 Documentação oficial NestJS:  
> [https://docs.nestjs.com](https://docs.nestjs.com)

## 📚 Documentação complementar

- [Desenvolvimento](./docs/DESENVOLVIMENTO.md)
- [Produção](./docs/PRODUCAO.md)
- [Comandos úteis](./docs/README.commands.md)
- [Monitoramento com Grafana e Prometheus](./docs/README-GRAFANA.md)
- [Checklist de Produção](./docs/README-checklist-producao.md)
- [Módulo Users (arquitetura SOLID)](./src/modules/users/README.md)
- [Sistema de Tenant](./src/shared/tenant/README.md)

---

## 🧰 Tecnologias Utilizadas

- **NestJS 11**
- **TypeScript**
- **Prisma ORM** para acesso a banco de dados relacional
- **Zod** para validação de dados
- **JWT** para autenticação
- **Swagger** para documentação automática
- **Docker** para conteinerização
- **Arquitetura modular baseada em princípios SOLID**
- **Middleware e interceptadores reutilizáveis**
- **Logger customizado com Winston**
- **Gerenciamento de variáveis de ambiente com dotenv**
- **Rate Limiting** para proteção contra ataques
- **Métricas customizadas** com Prometheus
- **Health Checks** para monitoramento

---

## 🎯 Objetivo

> Fornecer uma estrutura backend robusta, escalável e reutilizável para todos os projetos da LoboCode com NestJS.

### Principais Benefícios:

- 🚀 Agilidade no start de novos serviços e APIs
- 🛡️ Segurança com autenticação JWT pronta
- 📐 Arquitetura limpa e modular
- 🧩 Reaproveitamento de middlewares, guards e services
- 🧪 Estrutura com suporte a testes unitários e e2e
- 🛠️ Pronto para produção com Docker e configurações de ambiente
- 📊 Monitoramento completo com logs estruturados e métricas
- 🔒 Proteção contra ataques com rate limiting

---

## 🗂️ Estrutura Inicial (Resumo)

```
src/
├── modules/           # Módulos da aplicação
│   ├── users/        # Gestão de usuários
│   ├── companies/    # Gestão de empresas
│   ├── units/        # Gestão de unidades
│   ├── products/     # Gestão de produtos
│   └── posts/        # Gestão de posts
├── shared/           # Recursos compartilhados
│   ├── auth/         # Autenticação e autorização
│   ├── prisma/       # Configuração do banco de dados
│   ├── casl/         # Controle de permissões
│   ├── tenant/       # Sistema de multi-tenancy
│   └── common/       # Utilitários comuns
│       ├── logger/   # Sistema de logging
│       ├── filters/  # Filtros de erro
│       ├── interceptors/ # Interceptadores
│       └── middleware/   # Middlewares
└── main.ts          # Ponto de entrada da aplicação
```

---

## 🚀 Funcionalidades Implementadas

### ✅ **Segurança**
- [x] Autenticação JWT
- [x] Autorização baseada em roles (CASL)
- [x] Rate limiting (100 req/15min por IP)
- [x] Headers de segurança (HSTS, XSS Protection)
- [x] Validação de dados com class-validator
- [x] Proteção contra arquivos sensíveis no Git

### ✅ **Monitoramento**
- [x] Health check endpoint (`/health`)
- [x] Métricas Prometheus (`/metrics`)
- [x] Logging estruturado com Winston
- [x] Métricas customizadas de performance
- [x] Alertas para requisições lentas

### ✅ **Infraestrutura**
- [x] Docker multi-stage build
- [x] Docker Compose para produção
- [x] Nginx como load balancer
- [x] PostgreSQL com health checks
- [x] Redis para cache
- [x] Grafana + Prometheus

### ✅ **Desenvolvimento**
- [x] Scripts de deploy automatizados
- [x] Verificação de segurança
- [x] Backup automático do banco
- [x] Hot reload em desenvolvimento

---

## 🔧 Configuração Rápida

### 1. **Instalar dependências**
```bash
npm install
```

### 2. **Configurar variáveis de ambiente**
```bash
cp env.example .env.production
# Edite o arquivo .env.production com suas configurações
```

### 3. **Executar verificação de segurança**
```bash
./scripts/security-check.sh
```

### 4. **Iniciar em desenvolvimento**
```bash
npm run start:dev
```

### 5. **Deploy em produção**
```bash
./deploy.sh full
```

---

## 📊 Endpoints Importantes

- **Health Check**: `GET /health`
- **Métricas**: `GET /metrics`
- **API Docs**: `GET /api` (se Swagger configurado)

---

## 🔒 Segurança

### Antes do Deploy
1. Execute `./scripts/security-check.sh`
2. Configure certificados SSL em `nginx/ssl/`
3. Atualize senhas no arquivo `.env.production`
4. Verifique se não há arquivos sensíveis no Git

### Monitoramento
- Logs: `logs/combined.log` e `logs/error.log`
- Métricas: Grafana em `http://localhost:3001`
- Health: `curl http://localhost:3000/health`

---

## 🚨 Checklist de Produção

- [x] Health check implementado
- [x] Logging estruturado configurado
- [x] Rate limiting implementado
- [x] Métricas customizadas configuradas
- [x] Arquivos sensíveis protegidos
- [ ] Testes unitários e de integração
- [ ] Backup externo configurado
- [ ] Alertas de monitoramento configurados

---

**Com essa estrutura, seu projeto estará muito mais seguro, estável e pronto para crescer!** 🚀
