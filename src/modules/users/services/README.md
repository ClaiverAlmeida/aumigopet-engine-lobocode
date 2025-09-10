# Services de Usuários - Infraseg

## 📋 Visão Geral

Este módulo implementa uma arquitetura modular para gerenciamento de usuários, separando as responsabilidades por tipo de usuário e mantendo funcionalidades comuns em um service base.

## 🏗️ Estrutura

```
services/
├── base/
│   └── base-user.service.ts          # ✅ Funcionalidades comuns
├── guard/
│   └── guard.service.ts              # ✅ Funcionalidades específicas de guardas
├── resident/
│   └── resident.service.ts           # ✅ Funcionalidades específicas de residentes de posto
├── platform-admin/
│   └── platform-admin.service.ts     # ✅ Funcionalidades específicas de admins da plataforma
├── admin/
│   └── admin.service.ts              # ✅ Funcionalidades específicas de admins de empresa
├── hr/
│   └── hr.service.ts                 # ✅ Funcionalidades específicas de RH
├── supervisor/
│   └── supervisor.service.ts         # ✅ Funcionalidades específicas de supervisores de guardas
├── post-supervisor/
│   └── post-supervisor.service.ts    # ✅ Funcionalidades específicas de síndicos de posto
├── user-query.service.ts             # ✅ Service de consultas e permissões
└── index.ts                          # ✅ Exportações centralizadas
```

## 🔧 Services

### BaseUserService

**Localização**: `services/base/base-user.service.ts`

**Responsabilidades**:

- ✅ Funcionalidades comuns a todos os usuários
- ✅ CRUD básico (findById, update, softDelete)
- ✅ Validações comuns (email, CPF, telefone)
- ✅ Paginação e filtros
- ✅ Controle de permissões básico
- ✅ **Validação de role configurada no construtor**

**Métodos principais**:
```typescript
async findById(id: string)
async update(id: string, updateUserDto: UpdateUserDto)
async softDelete(id: string)
async getAll(page = 1, limit = 20)
async findByCompany(companyId: string)
async findByPost(postId: string)
```

**Nova Abordagem de Validação de Role**:
```typescript
// ✅ CONSTRUTOR COM ROLE CONFIGURADO
constructor(
  userRepository: UserRepository,
  userValidator: UserValidator,
  userQueryService: UserQueryService,
  protected targetRole?: Roles, // Role configurado no construtor
) {}

// ✅ MÉTODOS QUE USAM ROLE CONFIGURADO
protected async validateCreatePermissionWithConfiguredRole()
protected async validateUpdatePermissionWithConfiguredRole()
protected async validateDeletePermissionWithConfiguredRole()
```

### GuardService

**Localização**: `services/guard/guard.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de guardas
- ✅ Atribuição a postos de segurança
- ✅ Validação de permissões específicas
- ✅ Gestão de rondas e turnos
- ✅ Relatórios de atividade

**Métodos principais**:
```typescript
async create(dto: CreateGuardDto)
async assignToPosts(guardId: string, postIds: string[])
async validatePermissions(guardId: string, permission: PermissionType)
async getActivePatrols(guardId: string)
async getShifts(guardId: string, date?: Date)
async getGuardsByPost(postId: string)
```

**Exemplo de Uso**:
```typescript
@Injectable()
export class GuardService extends BaseUserService {
  constructor(
    userRepository: UserRepository,
    userValidator: UserValidator,
    userQueryService: UserQueryService,
    private userFactory: UserFactory,
  ) {
    super(userRepository, userValidator, userQueryService, Roles.GUARD);
  }

  async create(dto: CreateGuardDto) {
    // ✅ SEM PARÂMETROS - usa role configurado no construtor
    await this.validateCreatePermissionWithConfiguredRole();
    
    // Resto da lógica...
  }
}
```

### PostResidentService

**Localização**: `services/resident/resident.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de residentes de posto
- ✅ Busca por empresa, posto, prédio e apartamento
- ✅ Histórico de acesso
- ✅ Gestão de visitantes e veículos
- ✅ Perfis personalizados

**Métodos principais**:
```typescript
async create(dto: CreatePostResidentDto)
async getResidentsByCompany(companyId: string)
async getResidentsByPost(postId: string)
async getResidentsByBuilding(buildingId: string)
async getResidentsByApartment(apartmentId: string)
async getResidentAccessHistory(id: string, startDate?: Date, endDate?: Date)
```

### PlatformAdminService

**Localização**: `services/platform-admin/platform-admin.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de admins da plataforma
- ✅ Estatísticas do sistema
- ✅ Logs e auditoria
- ✅ Configurações globais
- ✅ Backup e restauração

**Métodos principais**:
```typescript
async create(dto: CreatePlatformAdminDto)
async getAllPlatformAdmins()
async getSystemStatistics()
async getSystemLogs(startDate?: Date, endDate?: Date)
async manageSystemSettings(settings: any)
async backupSystem()
async restoreSystem(backupId: string)
```

### AdminService

**Localização**: `services/admin/admin.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de admins de empresa
- ✅ Estatísticas da empresa
- ✅ Relatórios corporativos
- ✅ Configurações da empresa
- ✅ Gestão de usuários da empresa

**Métodos principais**:
```typescript
async create(dto: CreateAdminDto)
async getAdminsByCompany(companyId: string)
async getCompanyStatistics(companyId: string)
async getCompanyReports(companyId: string, startDate?: Date, endDate?: Date)
async manageCompanySettings(companyId: string, settings: any)
async getCompanyUsers(companyId: string, role?: string)
```

### HRService

**Localização**: `services/hr/hr.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de RH
- ✅ Lista de funcionários
- ✅ Relatórios de RH
- ✅ Escalas de trabalho
- ✅ Métricas de performance

**Métodos principais**:
```typescript
async create(dto: CreateHRDto)
async getHRByCompany(companyId: string)
async getEmployeeList(companyId: string, filters?: any)
async getEmployeeDetails(employeeId: string)
async updateEmployeeStatus(employeeId: string, status: any)
async getEmployeeReports(companyId: string, startDate?: Date, endDate?: Date)
async getWorkSchedule(employeeId: string, startDate?: Date, endDate?: Date)
async getAttendanceReport(companyId: string, date?: Date)
async getPerformanceMetrics(employeeId: string)
```

### SupervisorService

**Localização**: `services/supervisor/supervisor.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de supervisores de guardas
- ✅ Atribuição de guardas ao supervisor
- ✅ Relatórios de performance de guardas
- ✅ Gestão de escalas e aprovações
- ✅ Métricas de supervisão de equipe

**Métodos principais**:
```typescript
async create(dto: CreateSupervisorDto)
async getSupervisorsByCompany(companyId: string)
async getManagedGuards(supervisorId: string)
async assignGuardsToSupervisor(supervisorId: string, guardIds: string[])
async getGuardPerformanceReport(supervisorId: string, guardId: string, startDate?: Date, endDate?: Date)
async getTeamPerformanceReport(supervisorId: string, startDate?: Date, endDate?: Date)
async getGuardSchedule(supervisorId: string, guardId: string, date?: Date)
async approveGuardSchedule(supervisorId: string, guardId: string, scheduleId: string)
async getGuardIncidents(supervisorId: string, guardId: string)
async createGuardReport(supervisorId: string, guardId: string, reportData: any)
async getSupervisorMetrics(supervisorId: string)
```

### PostSupervisorService

**Localização**: `services/post-supervisor/post-supervisor.service.ts`

**Responsabilidades**:

- ✅ Criação e gerenciamento de síndicos de posto
- ✅ Atribuição a postos específicos
- ✅ Gestão de equipe do posto
- ✅ Relatórios do posto
- ✅ Métricas de síndico

**Métodos principais**:
```typescript
async create(dto: CreatePostSupervisorDto)
async getSupervisorsByCompany(companyId: string)
async getSupervisorsByPost(postId: string)
async assignToPost(supervisorId: string, postId: string)
async getPostStaff(postId: string)
async getPostReports(postId: string, startDate?: Date, endDate?: Date)
async getPostIncidents(postId: string)
async getPostPatrols(postId: string, date?: Date)
async getPostShifts(postId: string, date?: Date)
async getSupervisorMetrics(supervisorId: string)
```

## 🎯 Benefícios da Arquitetura

### ✅ Responsabilidade Única

- Cada service tem uma responsabilidade específica
- Código mais organizado e fácil de manter
- Facilita testes unitários

### ✅ Manutenibilidade

- Mudanças em um tipo de usuário não afetam outros
- Código mais limpo e legível
- Facilita debugging

### ✅ Testabilidade

- Services isolados são mais fáceis de testar
- Mocks mais simples
- Cobertura de testes mais específica

### ✅ Escalabilidade

- Fácil adicionar novos tipos de usuário
- Funcionalidades podem ser estendidas independentemente
- Performance otimizada por tipo

### ✅ **Nova Abordagem de Validação**

- **Role configurado no construtor** - sem parâmetros nos métodos
- **Validação automática** - usa o role configurado
- **Código mais limpo** - menos repetição
- **Fácil manutenção** - role definido uma vez

## 🚀 Próximos Passos

1. **Implementar validações específicas** nos métodos TODO
2. **Adicionar testes unitários** para cada service
3. **Implementar funcionalidades avançadas** (logs, métricas, relatórios)
4. **Criar controllers específicos** para cada tipo de usuário
5. **Adicionar documentação de API** com Swagger
6. **Implementar cache** para consultas frequentes
7. **Adicionar auditoria** completa de ações

## 📝 Notas de Implementação

- Todos os services herdam de `BaseUserService`
- Validações comuns são reutilizadas
- Permissões são controladas pelo `UserQueryService`
- Factory pattern é usado para criação de usuários
- Repository pattern para acesso a dados
- Soft delete implementado em todos os services
- **Role configurado no construtor** para validações automáticas

## 🔐 Nova Abordagem de Validação de Role

### ✅ **Antes (com parâmetros)**:
```typescript
async create(dto: CreateAdminDto) {
  await this.validateCreatePermission(Roles.ADMIN); // ❌ Parâmetro repetido
}
```

### ✅ **Depois (role no construtor)**:
```typescript
constructor(
  userRepository: UserRepository,
  userValidator: UserValidator,
  userQueryService: UserQueryService,
  private userFactory: UserFactory,
) {
  super(userRepository, userValidator, userQueryService, Roles.ADMIN); // ✅ Role configurado
}

async create(dto: CreateAdminDto) {
  await this.validateCreatePermissionWithConfiguredRole(); // ✅ Sem parâmetros
}
```

### ✅ **Benefícios**:
- **Menos repetição** de código
- **Role definido uma vez** no construtor
- **Validação automática** em todos os métodos
- **Código mais limpo** e legível
- **Fácil manutenção** e extensão
  