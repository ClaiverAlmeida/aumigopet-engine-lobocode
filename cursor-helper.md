# 🤖 Cursor AI Helper - iFraseg Engine

## 📋 Contexto do Projeto
- **Projeto**: iFraseg Engine (Sistema de Segurança Patrimonial)
- **Stack**: NestJS + TypeScript + Prisma + PostgreSQL
- **Arquitetura**: Multi-tenant, Sistema de Roles, Modular

## 🔗 Regras Obrigatórias
- **Arquivo**: `.cursor/rules/nestjs-rules.mdc`
- **Documentação**: `docs/NAMING_CONVENTIONS.md`
- **Contexto Completo**: `projeto-context.md`

## 🎯 Padrões Essenciais

### Nomenclatura
- **Métodos**: `buscarUserPorId()`, `validarSeUserExiste()`, `criarNovoAdmin()`
- **Entidades**: `User`, `Company`, `Post`, `Role` (inglês)
- **Propriedades**: `id`, `name`, `email`, `companyId` (inglês)
- **Endpoints**: `obterTodosOsUsers()`, `updateDadosDoUser()` (português)

### Arquitetura Modular
```
Repository → Validator → Factory → Service → Controller
```

### CRUD Genérico
```typescript
buscarTodos(page, limit)    // Lista com paginação
buscarPorId(id)            // Busca específica
criar(dto)                 // Criação
atualizar(id, dto)         // Atualização
desativar(id)              // Soft delete
```

### Sistema de Mensagens
```typescript
// Usar constantes centralizadas
VALIDATION_MESSAGES.REQUIRED.NAME
ERROR_MESSAGES.RESOURCE.NOT_FOUND
SUCCESS_MESSAGES.CRUD.CREATED
```

## 🚨 Lembretes Importantes
- ✅ Sempre usar validators customizados
- ✅ Implementar sistema de filtros para erros
- ✅ Seguir padrão multi-tenant
- ✅ Documentar com JSDoc
- ✅ Testes unitários obrigatórios

## 📚 Referências Rápidas
- Roles: `SYSTEM_ADMIN`, `ADMIN`, `SUPERVISOR`, `HR`, `GUARD`, `POST_SUPERVISOR`, `POST_RESIDENT`
- Validações: `@IsStrongPassword()`, `@IsUniqueEmail()`, `@IsUniqueCPF()`
- Filtros: `TokenExpiredError`, `ValidationError`, `NotFoundError`

## 🔧 Para Contexto Completo
📄 **Leia**: `projeto-context.md` - Regras de negócio, exemplos práticos, configurações

---
**💡 Dica**: Sempre mencionar "seguindo as regras do projeto" para garantir conformidade! 