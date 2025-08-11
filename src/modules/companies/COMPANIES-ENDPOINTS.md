# 🏢 **COMPANIES API ENDPOINTS**

## 📋 **ENDPOINTS CRUD BÁSICOS**

### **📖 LEITURA**

#### `GET /companies` - Lista com paginação
```bash
GET /companies?page=1&limit=10
```
- **Parâmetros**: `page` (opcional), `limit` (opcional)
- **Resposta**: Lista paginada de empresas

#### `GET /companies/all` - Lista todas
```bash
GET /companies/all
```
- **Resposta**: Array com todas as empresas ativas

#### `GET /companies/:id` - Busca por ID
```bash
GET /companies/123e4567-e89b-12d3-a456-426614174000
```
- **Parâmetros**: `id` (UUID da empresa)
- **Resposta**: Dados da empresa ou 404

### **🔍 BUSCA ESPECIALIZADA**

#### `GET /companies/search/cnpj/:cnpj` - Busca por CNPJ
```bash
GET /companies/search/cnpj/12345678000195
```
- **Parâmetros**: `cnpj` (CNPJ da empresa)
- **Resposta**: Dados da empresa com o CNPJ especificado

#### `GET /companies/search/name` - Busca por Nome
```bash
GET /companies/search/name?name=TechCorp
```
- **Parâmetros**: `name` (obrigatório) - Nome da empresa
- **Resposta**: Array de empresas com nome correspondente

### **✏️ ESCRITA**

#### `POST /companies` - Criar empresa
```bash
POST /companies
Content-Type: application/json

{
  "name": "TechCorp Ltda",
  "cnpj": "12345678000195",
  "email": "contato@techcorp.com",
  "phone": "+5511999999999",
  "website": "https://techcorp.com"
}
```
- **Status**: 201 Created
- **Body**: `CreateCompanyDto`

#### `PATCH /companies/:id` - Atualizar empresa
```bash
PATCH /companies/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "TechCorp SA",
  "website": "https://newtechcorp.com"
}
```
- **Body**: `UpdateCompanyDto` (campos opcionais)

#### `DELETE /companies/:id` - Desativar empresa (soft delete)
```bash
DELETE /companies/123e4567-e89b-12d3-a456-426614174000
```
- **Status**: 200 OK
- **Resposta**: Mensagem de confirmação

#### `POST /companies/:id/restore` - Reativar empresa
```bash
POST /companies/123e4567-e89b-12d3-a456-426614174000/restore
```
- **Status**: 200 OK
- **Resposta**: Mensagem de confirmação

---

## 📊 **ENDPOINTS DE AUDITORIA E MÉTRICAS**

> **🔒 Requer**: `SYSTEM_ADMIN` ou `ADMIN`

### **📈 MÉTRICAS**

#### `GET /companies/metrics` - Métricas de empresas
```bash
GET /companies/metrics?startDate=2024-01-01&endDate=2024-12-31&userId=123&action=create
```

**Parâmetros de Query:**
- `startDate` (opcional): Data início (ISO string)
- `endDate` (opcional): Data fim (ISO string)
- `userId` (opcional): Filtrar por usuário específico
- `action` (opcional): Filtrar por ação (`create`, `read`, `update`, `delete`)

**Resposta:**
```json
{
  "totalRequests": 1500,
  "successfulRequests": 1450,
  "failedRequests": 50,
  "successRate": 96.67,
  "mostRequestedByEntity": [
    { "entityName": "company", "action": "read", "count": 800 },
    { "entityName": "company", "action": "create", "count": 300 }
  ],
  "mostDeniedByEntity": [
    { "entityName": "company", "action": "delete", "count": 25 }
  ],
  "requestsByRole": {
    "ADMIN": 900,
    "MANAGER": 400,
    "USER": 200
  },
  "requestsByCompany": {
    "company-uuid-1": 800,
    "company-uuid-2": 700
  }
}
```

### **📋 LOGS**

#### `GET /companies/logs` - Logs de auditoria
```bash
GET /companies/logs?limit=100&startDate=2024-01-01&userId=123&action=create&success=true
```

**Parâmetros de Query:**
- `limit` (opcional, padrão: 100): Número máximo de logs
- `startDate` (opcional): Data início (ISO string)
- `endDate` (opcional): Data fim (ISO string)
- `userId` (opcional): Filtrar por usuário específico
- `action` (opcional): Filtrar por ação (`create`, `read`, `update`, `delete`)
- `success` (opcional): Filtrar por sucesso (`true`/`false`)

**Resposta:**
```json
{
  "data": [
    {
      "userId": "user-uuid-123",
      "userRole": "ADMIN",
      "action": "create",
      "entityName": "company",
      "resourceId": "company-uuid-456",
      "timestamp": "2024-01-15T10:30:00Z",
      "success": true,
      "ipAddress": "192.168.1.100"
    }
  ]
}
```

#### `GET /companies/logs/failures` - Logs de falhas
```bash
GET /companies/logs/failures?limit=50&startDate=2024-01-01
```

**Parâmetros de Query:**
- `limit` (opcional, padrão: 50): Número máximo de logs
- `startDate` (opcional): Data início (ISO string)
- `endDate` (opcional): Data fim (ISO string)

**Resposta:** Apenas logs com `success: false`

### **📊 ANÁLISES**

#### `GET /companies/analytics/usage` - Estatísticas de uso
```bash
GET /companies/analytics/usage?startDate=2024-01-01&endDate=2024-12-31
```

**Parâmetros de Query:**
- `startDate` (opcional): Data início (ISO string)
- `endDate` (opcional): Data fim (ISO string)

**Resposta:**
```json
{
  "totalOperacoes": 1500,
  "operacoesBemsucedidas": 1450,
  "operacoesFalharam": 50,
  "taxaDeSucesso": 96.67,
  "percentualDoSistema": 35.5,
  "acoesPopulares": {
    "read": 800,
    "create": 300,
    "update": 250,
    "delete": 150
  },
  "periodo": {
    "inicio": "2024-01-01T00:00:00Z",
    "fim": "2024-12-31T23:59:59Z"
  }
}
```

### **📤 EXPORTAÇÃO**

#### `GET /companies/export/logs` - Exportar logs
> **🔒 Requer**: `SYSTEM_ADMIN`

```bash
GET /companies/export/logs?format=csv&startDate=2024-01-01&action=create
```

**Parâmetros de Query:**
- `format` (opcional, padrão: 'json'): Formato (`json` | `csv`)
- `startDate` (opcional): Data início (ISO string)
- `endDate` (opcional): Data fim (ISO string)
- `userId` (opcional): Filtrar por usuário específico
- `action` (opcional): Filtrar por ação
- `success` (opcional): Filtrar por sucesso

**Resposta:**
- **JSON**: Arquivo JSON com todos os logs
- **CSV**: Arquivo CSV pronto para Excel/planilhas

---

## 🔐 **AUTENTICAÇÃO E AUTORIZAÇÃO**

### **Headers Obrigatórios:**
```bash
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### **Níveis de Acesso:**

| Endpoint | SYSTEM_ADMIN | ADMIN | MANAGER | USER |
|----------|--------------|-------|---------|------|
| CRUD Básico | ✅ | ✅ | ✅ | ❌ |
| Busca | ✅ | ✅ | ✅ | ✅ |
| Métricas | ✅ | ✅ | ❌ | ❌ |
| Logs | ✅ | ✅ | ❌ | ❌ |
| Análises | ✅ | ✅ | ❌ | ❌ |
| Exportação | ✅ | ❌ | ❌ | ❌ |

---

## 📝 **EXEMPLOS DE USO**

### **Cenário 1: Criar empresa**
```bash
curl -X POST http://localhost:3000/companies \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa Teste Ltda",
    "cnpj": "12345678000195",
    "email": "teste@empresa.com",
    "phone": "+5511999999999"
  }'
```

### **Cenário 2: Buscar empresa por CNPJ**
```bash
curl -X GET http://localhost:3000/companies/search/cnpj/12345678000195 \
  -H "Authorization: Bearer <token>"
```

### **Cenário 3: Obter métricas do último mês**
```bash
curl -X GET "http://localhost:3000/companies/metrics?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <token>"
```

### **Cenário 4: Exportar logs de falhas em CSV**
```bash
curl -X GET "http://localhost:3000/companies/export/logs?format=csv&success=false" \
  -H "Authorization: Bearer <token>" \
  > companies_failures.csv
```

---

## ⚠️ **CÓDIGOS DE ERRO**

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| 400 | Bad Request | Dados inválidos ou parâmetros obrigatórios faltando |
| 401 | Unauthorized | Token inválido ou expirado |
| 403 | Forbidden | Usuário sem permissão para a operação |
| 404 | Not Found | Empresa não encontrada |
| 409 | Conflict | CNPJ já existe (ao criar/atualizar) |
| 422 | Unprocessable Entity | Falha de validação nos DTOs |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 🚀 **FUNCIONALIDADES AVANÇADAS**

### **Multi-tenancy Automático**
- ✅ Todos os endpoints respeitam automaticamente o contexto da empresa do usuário
- ✅ Filtragem automática por `companyId` quando aplicável

### **Auditoria Automática**
- ✅ Todas as operações são automaticamente registradas
- ✅ Contexto completo: usuário, IP, timestamp, resultado

### **Validações Automáticas**
- ✅ CNPJ validado automaticamente
- ✅ Campos obrigatórios verificados
- ✅ Unicidade garantida

### **Soft Delete**
- ✅ Empresas são desativadas, não removidas
- ✅ Possibilidade de reativação
- ✅ Histórico preservado