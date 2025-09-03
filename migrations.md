## 🚨 **Problema de Schema Desatualizado - Migration Necessária**

### **❌ Erro Atual:**
```
The column `VehicleChecklist.pneusDianteiroFuncionando` does not exist in the current database.
```

### **🎯 Situação:** 
- Código tem novas colunas
- Banco não tem as colunas
- **PRECISAMOS** rodar migration **SEM PERDER DADOS**

## 🛠️ **Solução: Migration Segura**

### **1. Primeiro, fazer backup do banco:**
```bash
docker exec infraseg-db pg_dump -U postgres infraseg-engine > backup_$(date +%Y%m%d_%H%M%S).sql
```
### **2. Verificar se há migrações pendentes:**
```bash
docker exec infraseg-backend npx prisma migrate status
```
### **3. Aplicar migrações pendentes (SEGURO - não perde dados):**
```bash
docker exec infraseg-backend npx prisma migrate deploy
```
### **4. Se não tiver migrações, gerar baseado no schema atual:**
```bash
docker exec infraseg-backend npx prisma db push
```
## 💡 **Comandos para Executar:**

### **🔒 1. Backup primeiro (OBRIGATÓRIO):**
```bash
docker exec infraseg-db pg_dump -U postgres infraseg-engine > backup_$(date +%Y%m%d_%H%M%S).sql
```

### **📋 2. Verificar migrações:**
```bash
docker exec infraseg-backend npx prisma migrate status
```

### **🚀 3. Aplicar migrações (SEGURO):**
```bash
# Opção 1: Se existem migrações pendentes
docker exec infraseg-backend npx prisma migrate deploy

# Opção 2: Se não há migrações, sincronizar schema
docker exec infraseg-backend npx prisma db push
```

### **✅ 4. Verificar se funcionou:**
```bash
docker exec infraseg-backend npx prisma db pull
```

## 🎯 **Por que é SEGURO:**

- ✅ **`migrate deploy`**: Aplica apenas migrações, preserva dados
- ✅ **`db push`**: Adiciona colunas/tabelas, preserva dados existentes  
- ✅ **Backup**: Se algo der errado, restauramos
- ❌ **`migrate reset`**: **NÃO USAR** - apaga todos os dados

**Qual comando quer executar primeiro?**