# 🚀 Plano de Implementação - Integração Frontend & Backend
## AUMIGOPET Engine + AUMIGOPET App

> **📋 Contexto**: Plano completo para implementar o backend e integrar com o frontend já desenvolvido

---

## 📊 **Status Atual**

### ✅ **Frontend Desenvolvido (AUMIGOPET App)**
- **Angular 18** com **Signals** e **Standalone Components**
- **7 páginas principais** implementadas
- **Dynamic Forms** com configuração
- **Services** estruturados com estado reativo
- **PWA Ready** com storage local

### ✅ **Backend Existente (AUMIGOPET Engine)**
- **NestJS 11** + **TypeScript** + **Prisma** + **PostgreSQL**
- **Arquitetura SOLID**: Repository → Validator → Factory → Service → Controller
- **Multi-tenancy** e **Sistema de Roles** implementados
- **Sistema de Mensagens** e **Filtros de Erro** centralizados

---

## 🎯 **Páginas Frontend que Precisam de Backend**

| **#** | **Página** | **Rota** | **Funcionalidade** | **Status** |
|-------|------------|----------|-------------------|------------|
| 1 | **Start Shift** | `/turno` | Controle de turnos | ⏳ Backend pendente |
| 2 | **Vehicle Checklist** | `/check-veiculo` | Checklist de veículos | ⏳ Backend pendente |
| 3 | **Supply Registration** | `/cadastro-abastecimento` | Cadastro de abastecimento | ⏳ Backend pendente |
| 4 | **Motorized Service Report** | `/relatorio-servico-motorizado` | Relatório de serviço motorizado | ⏳ Backend pendente |
| 5 | **Occurrence Report** | `/relatorio-ocorrencia` | Relatório de ocorrências | ⏳ Backend pendente |
| 6 | **Patrol** | `/ronda` | Sistema de rondas | 🔄 Parcialmente implementado |
| 7 | **Home** | `/` | Dashboard principal | ✅ Funcional |

---

## 🗃️ **Schema do Banco - Extensões Necessárias**

### **📋 Estado Atual do Schema**
```prisma
// ✅ JÁ IMPLEMENTADOS
- User (com sistema de roles)
- Company (multi-tenancy)
- Post (postos de segurança)
- Patrol (rondas básicas)
- Checkpoint (pontos de verificação)
- Shift (turnos básicos)
- EventLog (logs de eventos)
- PanicEvent (eventos de pânico)
```

### **🔄 Extensões Necessárias**

#### **1. Atualizar Modelo Shift**
```prisma
// Expandir modelo existente para suportar frontend
model Shift {
  id                String      @id @default(cuid())
  userId            String      // Renomear de guardId
  companyId         String      // Adicionar
  postId            String
  startTime         DateTime    // Renomear de dateTime
  endTime           DateTime?   // Adicionar
  breakStartTime    DateTime?   // Adicionar
  breakEndTime      DateTime?   // Adicionar
  function          ShiftFunction // Adicionar enum
  status            ShiftStatus @default(PENDING) // Expandir
  
  // Relacionamentos
  user              User        @relation(fields: [userId], references: [id])
  company           Company     @relation(fields: [companyId], references: [id])
  post              Post        @relation(fields: [postId], references: [id])
  rounds            Patrol[]     // Adicionar relacionamento
  occurrences       Occurrence[] // Adicionar relacionamento
  
  // Auditoria
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  deletedAt         DateTime?
  createdBy         String?
  updatedBy         String?
  
  @@map("shifts")
}

enum ShiftFunction {
  PATROL   // Ronda
  SUPPORT  // Vigilante (Apoio)
  DOORMAN  // Portaria
}

enum ShiftStatus {
  PENDING      // Pendente
  IN_PROGRESS  // Em andamento
  BREAK        // Intervalo
  COMPLETED    // Concluído
  ABSENCE      // Ausência
}
```

#### **2. Atualizar Modelo Patrol**
```prisma
// Expandir modelo existente
model Patrol {
  id                  String            @id @default(cuid())
  userId              String            // Renomear de guardId
  companyId           String            // Adicionar
  postId              String
  shiftId             String            // Adicionar relacionamento
  startTime           DateTime          // Renomear de start
  endTime             DateTime?         // Renomear de end
  status              PatrolStatus       @default(IDLE) // Expandir
  description         String?           // Adicionar
  supervisorApproval  Boolean?          // Adicionar
  
  // Relacionamentos
  user                User              @relation("UserPatrols", fields: [userId], references: [id])
  company             Company           @relation(fields: [companyId], references: [id])
  post                Post              @relation(fields: [postId], references: [id])
  shift               Shift             @relation(fields: [shiftId], references: [id])
  checkpoints         PatrolCheckpoint[] // Renomear de roundPoints
  
  // Auditoria
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  deletedAt           DateTime?
  createdBy           String?
  updatedBy           String?
  
  @@map("rounds")
}

enum PatrolStatus {
  IDLE        // Aguardando
  STARTED     // Em andamento
  PAUSED      // Pausada
  COMPLETED   // Concluída
  CANCELLED   // Cancelada
}
```

#### **3. Atualizar Modelo PatrolCheckpoint**
```prisma
// Renomear e expandir PatrolPoint
model PatrolCheckpoint {
  id              String               @id @default(cuid())
  roundId         String
  checkpointId    String
  completedAt     DateTime?            // Renomear de checkedAt
  latitude        Float?               // Adicionar GPS
  longitude       Float?               // Adicionar GPS
  status          CheckpointStatus     @default(PENDING) // Expandir
  notes           String?              // Adicionar
  
  // Relacionamentos
  round           Patrol                @relation(fields: [roundId], references: [id])
  checkpoint      Checkpoint           @relation(fields: [checkpointId], references: [id])
  
  // Auditoria
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  
  @@map("round_checkpoints")
}

enum CheckpointStatus {
  PENDING     // Pendente
  COMPLETED   // Concluído
  SKIPPED     // Pulado
}
```

#### **4. Expandir Modelo Checkpoint**
```prisma
// Expandir modelo existente
model Checkpoint {
  id                  String               @id @default(cuid())
  companyId           String               // Adicionar
  postId              String
  name                String
  description         String?              // Adicionar
  latitude            Float                // Adicionar GPS obrigatório
  longitude           Float                // Adicionar GPS obrigatório
  required            Boolean              @default(false) // Adicionar
  category            CheckpointCategory   // Adicionar
  estimatedDuration   Int?                 // Minutos estimados
  isActive            Boolean              @default(true) // Adicionar
  
  // Relacionamentos
  company             Company              @relation(fields: [companyId], references: [id])
  post                Post                 @relation(fields: [postId], references: [id])
  roundCheckpoints    PatrolCheckpoint[]    // Renomear de roundPoints
  
  // Auditoria
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  deletedAt           DateTime?
  createdBy           String?
  updatedBy           String?
  
  @@map("checkpoints")
}

enum CheckpointCategory {
  SECURITY      // Segurança
  MAINTENANCE   // Manutenção
  INSPECTION    // Inspeção
  GENERAL       // Geral
}
```

#### **5. Adicionar Novo Modelo Occurrence**
```prisma
model Occurrence {
  id                    String            @id @default(cuid())
  talaoNumber           String            // Auto-incrementa, reset diário
  userId                String
  companyId             String
  postId                String
  shiftId               String?           // Relacionar com turno
  date                  DateTime
  time        String            // HH:MM format
  applicant             String            // Solicitante
  collaboratorName      String            // Nome do colaborador
  rg                    String            // RG
  postAddress           String            // Endereço do posto
  peopleInvolved        String?           // Pessoas envolvidas
  description           String            // Descrição da ocorrência
  status                ReportStatus  @default(PENDING)
  
  // Relacionamentos
  user                  User              @relation(fields: [userId], references: [id])
  company               Company           @relation(fields: [companyId], references: [id])
  post                  Post              @relation(fields: [postId], references: [id])
  shift                 Shift?            @relation(fields: [shiftId], references: [id])
  
  // Auditoria
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  deletedAt             DateTime?
  createdBy             String?
  updatedBy             String?
  
  @@map("occurrences")
  @@index([talaoNumber])
  @@index([date])
  @@index([companyId])
}

enum ReportStatus {
  PENDING       // Pendente
  IN_PROGRESS   // Em andamento
  RESOLVED      // Resolvida
}
```

#### **6. Adicionar Modelos de Veículos**
```prisma
model Vehicle {
  id                String              @id @default(cuid())
  companyId         String
  plate             String              @unique // Placa única
  model             String              // Modelo
  brand             String              // Marca
  year              Int                 // Ano
  color             String?             // Cor
  isActive          Boolean             @default(true)
  
  // Relacionamentos
  company           Company             @relation(fields: [companyId], references: [id])
  checklists        VehicleChecklist[]
  supplies          Supply[]
  motorizedServices MotorizedService[]
  
  // Auditoria
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  deletedAt         DateTime?
  createdBy         String?
  updatedBy         String?
  
  @@map("vehicles")
  @@index([companyId])
  @@index([plate])
}

model VehicleChecklist {
  id                String                    @id @default(cuid())
  vehicleId         String
  userId            String
  companyId         String
  date              DateTime
  status            VehicleChecklistStatus    @default(PENDING)
  items             VehicleChecklistItem[]
  
  // Relacionamentos
  vehicle           Vehicle                   @relation(fields: [vehicleId], references: [id])
  user              User                      @relation(fields: [userId], references: [id])
  company           Company                   @relation(fields: [companyId], references: [id])
  
  // Auditoria
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt
  
  @@map("vehicle_checklists")
}

model VehicleChecklistItem {
  id                String              @id @default(cuid())
  checklistId       String
  itemName          String              // Nome do item
  status            ChecklistItemStatus // Status da verificação
  notes             String?             // Observações
  
  // Relacionamento
  checklist         VehicleChecklist    @relation(fields: [checklistId], references: [id])
  
  @@map("vehicle_checklist_items")
}

enum VehicleChecklistStatus {
  PENDING     // Pendente
  COMPLETED   // Concluído
}

enum ChecklistItemStatus {
  OK          // OK
  NOK         // Não OK
  NOT_CHECKED // Não verificado
}
```

#### **7. Adicionar Modelo Supply**
```prisma
model Supply {
  id                String      @id @default(cuid())
  vehicleId         String
  userId            String
  companyId         String
  driverName        String      // Nome/Assinatura do motorista
  date              DateTime
  kmDeparture       Int         // Km de saída
  kmSupply          Int         // Km abastecimento
  kmReturn          Int         // Km retorno
  liters            Float       // Litros
  value             Float       // Valor
  
  // Relacionamentos
  vehicle           Vehicle     @relation(fields: [vehicleId], references: [id])
  user              User        @relation(fields: [userId], references: [id])
  company           Company     @relation(fields: [companyId], references: [id])
  
  // Auditoria
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  deletedAt         DateTime?
  createdBy         String?
  updatedBy         String?
  
  @@map("supplies")
  @@index([vehicleId])
  @@index([date])
}
```

#### **8. Adicionar Modelo MotorizedService**
```prisma
model MotorizedService {
  id                  String      @id @default(cuid())
  vehicleId           String
  userId              String
  companyId           String
  date                DateTime
  kmInitial           Int         // Km inicial
  kmFinal             Int         // Km final
  kmTraveled          Int         // Km percorrido
  timeInitial         String      // Hora inicial (HH:MM)
  timeFinal           String      // Hora final (HH:MM)
  fuel                String      // Combustível
  shift               String      // Turno
  streetPatrol        String      // Rondamento nas ruas
  occurrence          String      // Ocorrência
  vehicleInspection   String      // Vistoria do veículo
  
  // Relacionamentos
  vehicle             Vehicle     @relation(fields: [vehicleId], references: [id])
  user                User        @relation(fields: [userId], references: [id])
  company             Company     @relation(fields: [companyId], references: [id])
  
  // Auditoria
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  deletedAt           DateTime?
  createdBy           String?
  updatedBy           String?
  
  @@map("motorized_services")
  @@index([vehicleId])
  @@index([date])
}
```

#### **9. Adicionar Relacionamentos nos Modelos Existentes**
```prisma
// Adicionar em Company
model Company {
  // ... campos existentes
  shifts            Shift[]
  rounds            Patrol[]
  occurrences       Occurrence[]
  vehicles          Vehicle[]
  vehicleChecklists VehicleChecklist[]
  supplies          Supply[]
  motorizedServices MotorizedService[]
  checkpoints       Checkpoint[]
  // ... resto do modelo
}

// Adicionar em User  
model User {
  // ... campos existentes
  occurrences       Occurrence[]
  vehicleChecklists VehicleChecklist[]
  supplies          Supply[]
  motorizedServices MotorizedService[]
  // ... resto do modelo
}

// Adicionar em Post
model Post {
  // ... campos existentes
  occurrences       Occurrence[]
  // ... resto do modelo
}
```

---

## 🏗️ **Módulos Backend a Implementar**

### **📋 Seguindo Padrões do Projeto**
- **Arquitetura**: `Repository → Validator → Factory → Service → Controller`
- **Nomenclatura**: Métodos em português, entidades em inglês
- **Validações**: Centralizadas e customizadas
- **Mensagens**: Sistema centralizado
- **Multi-tenancy**: Isolamento por `companyId`

---

## 🚀 **Fase 1: Módulos Prioritários**

### **⏰ 1. Módulo SHIFTS (Turnos)**
**📁 Estrutura**: `src/modules/shifts/`

#### **Arquivos a Criar:**
```
src/modules/shifts/
├── dto/
│   ├── create-shift.dto.ts
│   ├── update-shift.dto.ts
│   └── shift-response.dto.ts
├── entities/
│   └── shift.entity.ts
├── services/
│   ├── shifts.service.ts
│   ├── shift-validator.service.ts
│   └── shift-factory.service.ts
├── repositories/
│   └── shifts.repository.ts
├── controllers/
│   └── shifts.controller.ts
├── guards/
│   └── shift-owner.guard.ts
└── shifts.module.ts
```

#### **APIs a Implementar:**
```typescript
// Seguindo padrões: métodos em português
POST   /shifts                    // criarNovoTurno()
GET    /shifts                    // buscarTodos()
GET    /shifts/:id                // buscarTurnoPorId()
PATCH  /shifts/:id/start          // iniciarTurno()
PATCH  /shifts/:id/break/start    // iniciarIntervalo()
PATCH  /shifts/:id/break/end      // finalizarIntervalo()
PATCH  /shifts/:id/end            // finalizarTurno()
GET    /shifts/current            // buscarTurnoAtual()
GET    /shifts/user/:userId       // buscarTurnosPorUser()
```

#### **Regras de Negócio:**
- ✅ Validar horário de trabalho (12h com tolerância de 5min)
- ✅ Apenas 1 turno ativo por usuário
- ✅ Controle de intervalo obrigatório
- ✅ Multi-tenancy por `companyId`
- ✅ Sistema de roles (apenas GUARD, SUPERVISOR podem iniciar turnos)

---

### **🚶 2. Módulo ROUNDS (Rondas)**
**📁 Estrutura**: `src/modules/rounds/`

#### **APIs a Implementar:**
```typescript
POST   /rounds                    // criarNovaRonda()
GET    /rounds                    // buscarTodas()
GET    /rounds/:id                // buscarRondaPorId()
PATCH  /rounds/:id/start          // iniciarRonda()
PATCH  /rounds/:id/pause          // pausarRonda()
PATCH  /rounds/:id/complete       // finalizarRonda()
POST   /rounds/:id/checkpoints    // adicionarCheckpoint()
PATCH  /rounds/:id/checkpoints/:checkpointId // atualizarCheckpoint()
GET    /rounds/active             // buscarRondasAtivas()
```

#### **Regras de Negócio:**
- ✅ Rondas horárias obrigatórias
- ✅ Validação GPS em checkpoints
- ✅ Checkpoints obrigatórios por posto
- ✅ Relacionamento com turno ativo
- ✅ Aprovação de supervisor para cancelamento

---

### **📝 3. Módulo OCCURRENCES (Ocorrências)**
**📁 Estrutura**: `src/modules/occurrences/`

#### **APIs a Implementar:**
```typescript
POST   /occurrences               // criarNovaOcorrencia()
GET    /occurrences               // buscarTodas()
GET    /occurrences/:id           // buscarOcorrenciaPorId()
PATCH  /occurrences/:id           // atualizarOcorrencia()
GET    /occurrences/talao/next    // obterProximoNumeroTalao()
GET    /occurrences/daily         // buscarOcorrenciasDoDia()
```

#### **Regras de Negócio:**
- ✅ Numeração automática de talão
- ✅ Reset diário às 00:00
- ✅ Relacionamento com turno/posto
- ✅ Workflow de status
- ✅ Campos obrigatórios conforme frontend

---

## 🚀 **Fase 2: Módulos Operacionais**

### **🚗 4. Módulo VEHICLES (Veículos)**
```typescript
POST   /vehicles                  // criarNovoVeiculo()
GET    /vehicles                  // buscarTodos()
GET    /vehicles/:id              // buscarVeiculoPorId()
POST   /vehicles/:id/checklist    // criarChecklistVeiculo()
GET    /vehicles/:id/checklists   // buscarChecklistsVeiculo()
```

### **⛽ 5. Módulo SUPPLIES (Abastecimento)**
```typescript
POST   /supplies                  // criarNovoAbastecimento()
GET    /supplies                  // buscarTodos()
GET    /supplies/:id              // buscarAbastecimentoPorId()
GET    /supplies/vehicle/:vehicleId // buscarPorVeiculo()
```

### **🚛 6. Módulo MOTORIZED_SERVICES (Serviços Motorizados)**
```typescript
POST   /motorized-services        // criarNovoServicoMotorizado()
GET    /motorized-services        // buscarTodos()
GET    /motorized-services/:id    // buscarServicoPorId()
GET    /motorized-services/vehicle/:vehicleId // buscarPorVeiculo()
```

---

## 📋 **Checklist de Implementação**

### **✅ Pré-requisitos**
- [ ] Atualizar schema Prisma com novas entidades
- [ ] Executar migration do banco
- [ ] Atualizar seed com dados de teste
- [ ] Validar tipos TypeScript

### **🔄 Fase 1 - Módulos Core**
- [ ] **Shifts**: Implementar CRUD completo
- [ ] **Patrols**: Sistema de rondas com GPS
- [ ] **Occurrences**: Relatórios com numeração automática
- [ ] **Testes**: Unitários e integração

### **🔄 Fase 2 - Módulos Operacionais**
- [ ] **Vehicles**: Gestão de veículos
- [ ] **Supplies**: Controle de abastecimento
- [ ] **Motorized Services**: Relatórios de serviços
- [ ] **Testes**: Cobertura completa

### **🔄 Fase 3 - Integração**
- [ ] **APIs**: Documentação Swagger
- [ ] **Frontend**: Atualizar services para consumir APIs
- [ ] **Autenticação**: Integrar com sistema existente
- [ ] **Permissões**: Validar roles por funcionalidade

### **🔄 Fase 4 - Refinamento**
- [ ] **Performance**: Otimizar queries
- [ ] **Cache**: Implementar estratégias
- [ ] **Logs**: Auditoria completa
- [ ] **Deploy**: Preparar para produção

---

## 🎯 **Próximos Passos Imediatos**

### **1. Atualizar Schema Prisma** ⚡
- Expandir modelos existentes
- Adicionar novos modelos
- Criar migration
- Executar seed atualizado

### **2. Implementar Módulo Shifts** ⚡
- Base para todos os outros módulos
- Controle de turnos crítico
- Integração direta com frontend

### **3. Implementar Módulo Patrols** ⚡
- Funcionalidade principal do sistema
- GPS e checkpoints obrigatórios
- Integração com sistema existente

### **4. Testar Integração** ⚡
- Consumo das APIs pelo frontend
- Validar fluxos completos
- Corrigir inconsistências

---

## 📚 **Documentação de Apoio**

### **📋 Referências Obrigatórias**
- `.cursor/rules/nestjs-rules.mdc` - Regras específicas
- `docs/NAMING_CONVENTIONS.md` - Nomenclatura
- `projeto-context.md` - Contexto completo
- `cursor-helper.md` - Padrões essenciais

### **📊 Estrutura de Dados Frontend**
- `occurrence-report.config.ts` - Campos de ocorrência
- `patrol.config.ts` - Configuração de rondas
- `supply-registration.config.ts` - Dados de abastecimento
- `motorized-service-report.config.ts` - Relatório motorizado
- `shift-control.component.ts` - Estados de turno

---

## 🚨 **Regras Críticas (OBRIGATÓRIO)**

### **1. Nomenclatura Consistente**
- ✅ **Métodos**: `buscarTurnoPorId()`, `criarNovaRonda()`
- ✅ **Entidades**: `Shift`, `Patrol`, `Occurrence`
- ✅ **Endpoints**: `obterTodosOsTurnos()`, `atualizarDadosRonda()`

### **2. Arquitetura SOLID**
- ✅ **Repository**: Acesso a dados
- ✅ **Validator**: Validações de negócio
- ✅ **Factory**: Criação de objetos
- ✅ **Service**: Orquestração
- ✅ **Controller**: Endpoints REST

### **3. Multi-tenancy**
- ✅ Sempre filtrar por `companyId`
- ✅ Validar pertencimento ao tenant
- ✅ Isolamento completo de dados

### **4. Sistema de Roles**
- ✅ Validar permissões por tipo de usuário
- ✅ Guards específicos por funcionalidade
- ✅ Controle granular de acesso

---

## 📈 **Estimativa de Tempo**

| **Fase** | **Módulos** | **Tempo Estimado** | **Prioridade** |
|----------|-------------|-------------------|----------------|
| **Fase 1** | Shifts, Patrols, Occurrences | 5-7 dias | 🔥 Alta |
| **Fase 2** | Vehicles, Supplies, Motorized | 3-5 dias | 🟡 Média |
| **Fase 3** | Integração & Testes | 2-3 dias | 🔥 Alta |
| **Fase 4** | Refinamento & Deploy | 1-2 dias | 🟡 Média |
| **Total** | **Implementação Completa** | **11-17 dias** | - |

---

## 💡 **Observações Finais**

### **✅ Vantagens da Abordagem**
- **Frontend pronto**: Reduz tempo de desenvolvimento
- **Arquitetura sólida**: Backend bem estruturado
- **Padrões definidos**: Consistência garantida
- **Multi-tenancy**: Escalabilidade built-in

### **⚠️ Pontos de Atenção**
- **Integração GPS**: Validar coordenadas em rondas
- **Numeração Talão**: Reset automático diário
- **Performance**: Otimizar queries com relacionamentos
- **Sincronização**: Frontend/Backend em tempo real

---

**📅 Criado**: Janeiro 2025  
**📝 Status**: Planejamento Completo  
**🔄 Próxima Atualização**: Conforme progresso da implementação

**🚀 PRONTO PARA IMPLEMENTAÇÃO!**