# 🗑️ AUMIGOPET - Arquivos para Deletar

> **Contexto**: Lista de arquivos do sistema antigo de segurança que não fazem mais sentido para o AUMIGOPET

---

## 📋 MÓDULOS COMPLETOS PARA DELETAR

### ✅ STATUS: Módulos já foram removidos ou nunca existiram

Os seguintes módulos **NÃO existem** no projeto atual:
- ✅ `src/modules/shifts/` - Já removido
- ✅ `src/modules/patrols/` - Já removido
- ✅ `src/modules/posts/` - Já removido
- ✅ `src/modules/reports/` - Já removido
- ✅ `src/modules/vehicles/` - Já removido
- ✅ `src/modules/checkpoints/` - Já removido
- ✅ `src/modules/occurrences/` - Já removido

**Resultado**: ✅ Nenhum módulo completo precisa ser deletado!

---

## 📄 ARQUIVOS INDIVIDUAIS PARA DELETAR

### Context Builders de Notificações (já desabilitados, podem ser deletados)
```bash
src/modules/notifications/entities/doorman-checklist/entities/doorman-checklist/
├── doorman-checklist.context-builder.ts
├── doorman-checklist.helper.ts
└── doorman-checklist.templates.ts

src/modules/notifications/entities/motorcycle-checklist/
├── motorcycle-checklist.context-builder.ts
├── motorcycle-checklist.helper.ts
└── motorcycle-checklist.templates.ts

src/modules/notifications/entities/motorized-service/
├── motorized-service.context-builder.ts
├── motorized-service.helper.ts
└── motorized-service.templates.ts

src/modules/notifications/entities/occurrence/
├── occurrence.context-builder.ts
├── occurrence.helper.ts
└── occurrence.templates.ts

src/modules/notifications/entities/occurrence-dispatch/
├── occurrence-dispatch.context-builder.ts
├── occurrence-dispatch.helper.ts
└── occurrence-dispatch.templates.ts

src/modules/notifications/entities/patrol/
├── patrol.context-builder.ts
├── patrol.helper.ts
└── patrol.templates.ts

src/modules/notifications/entities/shift/
├── shift.context-builder.ts
├── shift.helper.ts
└── shift.templates.ts

src/modules/notifications/entities/supply/
├── supply.context-builder.ts
├── supply.helper.ts
└── supply.templates.ts

src/modules/notifications/entities/vehicle-checklist/
├── vehicle-checklist.context-builder.ts
├── vehicle-checklist.helper.ts
└── vehicle-checklist.templates.ts
```
**Motivo**: Notificações de contexto de segurança que foram desabilitadas

---

## 📚 DOCUMENTAÇÃO PARA DELETAR OU ARQUIVAR

### Documentação de Contexto Antigo
```bash
docs/PLANO-IMPLEMENTACAO-INTEGRACAO.md  # Plano do sistema de segurança
docs/ANALISE_BACKEND_ATUAL.md           # Análise do backend de segurança
docs/FASE-1-FUNDACAO-SOLIDA.md          # Fases do projeto antigo
docs/PLANO-DESENVOLVIMENTO-FASES.md     # Desenvolvimento do projeto antigo
docs/ESCOPO-SISTEMA.md                  # Escopo do sistema de segurança
```
**Ação Sugerida**: Mover para `docs/archive/` ao invés de deletar (histórico)

---

## 🔍 MÓDULOS QUE EXISTEM ATUALMENTE

```bash
src/modules/
├── auth/                # ✅ Mantém - Autenticação
├── companies/           # ✅ Mantém - Multi-tenancy
├── notifications/       # ✅ Mantém - Sistema de notificações
├── service-bus/         # ✅ Mantém - Event bus
└── users/              # ✅ Mantém - Gerenciamento de usuários
```

**Todos os módulos existentes são necessários e já foram refatorados!**

---

## ⚠️ ARQUIVOS QUE **NÃO** DEVEM SER DELETADOS

### Manter Intactos
```bash
src/modules/users/          # ✅ Refatorado, mantém
src/modules/companies/      # ✅ Multi-tenancy, mantém
src/modules/notifications/  # ✅ Sistema core, mantém (apenas limpar contextos)
src/shared/                 # ✅ Utilities compartilhadas, mantém
src/common/                 # ✅ Recursos comuns, mantém
prisma/                     # ✅ Schema atualizado, mantém
```

---

## 📝 SCRIPT DE LIMPEZA (EXECUTAR)

```bash
#!/bin/bash
# Script para deletar context builders antigos e arquivar documentação

echo "🗑️ Iniciando limpeza de arquivos antigos do AUMIGOPET..."

# Deletar context builders de notificações antigas (EXISTEM e devem ser removidos)
rm -rf src/modules/notifications/entities/doorman-checklist
rm -rf src/modules/notifications/entities/motorcycle-checklist
rm -rf src/modules/notifications/entities/motorized-service
rm -rf src/modules/notifications/entities/occurrence
rm -rf src/modules/notifications/entities/occurrence-dispatch
rm -rf src/modules/notifications/entities/patrol
rm -rf src/modules/notifications/entities/shift
rm -rf src/modules/notifications/entities/supply
rm -rf src/modules/notifications/entities/vehicle-checklist

echo "✅ Context builders deletados (9 diretórios)"

# Arquivar documentação antiga (mover ao invés de deletar)
mkdir -p docs/archive/sistema-seguranca
mv docs/PLANO-IMPLEMENTACAO-INTEGRACAO.md docs/archive/sistema-seguranca/ 2>/dev/null
mv docs/ANALISE_BACKEND_ATUAL.md docs/archive/sistema-seguranca/ 2>/dev/null
mv docs/FASE-1-FUNDACAO-SOLIDA.md docs/archive/sistema-seguranca/ 2>/dev/null
mv docs/PLANO-DESENVOLVIMENTO-FASES.md docs/archive/sistema-seguranca/ 2>/dev/null
mv docs/ESCOPO-SISTEMA.md docs/archive/sistema-seguranca/ 2>/dev/null
mv docs/ANALISE_COMPLETA_FRONTEND.md docs/archive/sistema-seguranca/ 2>/dev/null

echo "✅ Documentação antiga arquivada"

echo ""
echo "🎉 Limpeza concluída!"
echo ""
echo "📊 Resumo:"
echo "  - Context builders deletados: 9 diretórios"
echo "  - Documentação arquivada: ~6 arquivos"
echo ""
echo "⚠️  Próximos passos:"
echo "  1. Execute: npm run build"
echo "  2. Verifique se não há erros"
echo "  3. Commit das alterações"
```

**Para executar:**
```bash
cd /home/claiver/projetos/Aumigopet/aumigo-pet-engine-lobocode
bash docs/ARQUIVOS-PARA-DELETAR.md  # Copie o script acima para um arquivo .sh
```

---

## 🎯 CHECKLIST DE VALIDAÇÃO PÓS-LIMPEZA

Após deletar os arquivos, execute:

- [ ] `npm run build` - Compilação deve passar
- [ ] `npm run test` - Testes devem passar
- [ ] Verificar imports quebrados
- [ ] Validar `app.module.ts` (já limpo)
- [ ] Verificar dependências no `package.json`
- [ ] Testar servidor: `npm run start:dev`

---

## 📊 IMPACTO ESTIMADO

### Arquivos que Serão Removidos
- **Módulos completos**: ~7 módulos
- **Context builders**: ~9 diretórios
- **Documentação**: ~5 arquivos (arquivados)
- **Total estimado**: ~200-300 arquivos

### Espaço Liberado
- **Código**: ~10.000-15.000 linhas
- **Documentação**: ~2.000 linhas
- **Disk space**: ~1-2 MB

### Benefícios
- ✅ Código mais limpo e focado
- ✅ Menos confusão sobre contexto
- ✅ Build mais rápido
- ✅ Navegação mais fácil
- ✅ Menos dependências desnecessárias

---

## 🚨 ATENÇÃO

**IMPORTANTE**: Antes de deletar, certifique-se de:
1. ✅ Fazer commit do estado atual
2. ✅ Criar backup (opcional)
3. ✅ Verificar que não há imports para esses módulos em outros lugares
4. ✅ Testar compilação após cada remoção grande

---

**📅 Criado**: Janeiro 2025  
**🎯 Objetivo**: Limpar código legado do sistema de segurança  
**⚠️ Status**: Pronto para execução (após aprovação)

