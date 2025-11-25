# 🏷️ Convenções de Nomenclatura - AUMIGOPET Engine

## 🎯 Resumo Executivo

Este documento complementa o `CODING_STANDARDS.md` com foco específico em convenções de nomenclatura, fornecendo exemplos práticos e regras claras para o projeto.

## 📋 Regras Fundamentais

### 1. **Entidades SEMPRE em Inglês**

```typescript
// ✅ Correto
User, Company, Post, Role, Shift, Patrol, EventLog, PanicEvent

// ❌ Incorreto
Usuario, Empresa, Posto, Papel, Turno, Ronda, LogEvento, EventoPanico
```

### 2. **Métodos SEMPRE em Português Literal**

```typescript
// ✅ Correto
buscarUserPorId()
validarSeUserExiste()
criarNovoAdmin()

// ❌ Incorreto
findUserById()
validateUserExists()
createNewAdmin()
```

### 3. **Propriedades SEMPRE em Inglês**

```typescript
// ✅ Correto
id, name, email, companyId, postId, role, active, deletedAt

// ❌ Incorreto
identificador, nome, email, idEmpresa, idPosto, papel, ativo, dataDeletado
```

## 🔍 Padrões por Categoria

### **Busca e Consulta**

```typescript
// Padrão: buscar[Entity]Por[Criteria]
buscarUserPorId(id: string)
buscarUserPorEmail(email: string)
buscarUsersPorCompany(companyId: string)
buscarUsersPorPost(postId: string)
buscarUsersPorRole(role: Roles)
buscarTodosOsUsers(page: number, limit: number)
buscarUsersAtivos()
buscarUsersDeletados()
```

### **Validação de Existência**

```typescript
// Padrão: validarSe[Entity]Existe
validarSeUserExiste(id: string)
validarSeCompanyExiste(companyId: string)
validarSePostExiste(postId: string)
validarSeRoleExiste(role: Roles)
```

### **Validação de Unicidade**

```typescript
// Padrão: validarSe[Field]EhUnico
validarSeEmailEhUnico(email: string, excludeUserId?: string)
validarSeCPFEhUnico(cpf: string, excludeUserId?: string)
validarSePhoneEhUnico(phone: string, excludeUserId?: string)
validarSeUsernameEhUnico(username: string, excludeUserId?: string)
```

### **Validação de Permissões**

```typescript
// Padrão: validarPermissaoPara[Action]
validarPermissaoParaRead()
validarPermissaoParaCreate()
validarPermissaoParaUpdate()
validarPermissaoParaDelete()
validarPermissaoParaExport()
validarPermissaoParaImport()
```

### **Validação de Capacidade**

```typescript
// Padrão: validarSePode[Action]
validarSePodeExecutarAction(action: string)
validarSePodeCriarUserComRole(targetRole: Roles)
validarSePodeUpdateUserComRole(targetRole: Roles)
validarSePodeDeleteUserComRole(targetRole: Roles)
validarSePodeAcessarCompany(companyId: string)
```

### **Criação de Entidades**

```typescript
// Padrão: criarNovo[Entity]
criarNovoUser(dto: CreateUserDto)
criarNovoAdmin(dto: CreateAdminDto)
criarNovoPlatformAdmin(dto: CreatePlatformAdminDto)
criarNovoGuard(dto: CreateGuardDto)
criarNovoHR(dto: CreateHRDto)
criarNovoSupervisor(dto: CreateSupervisorDto)
criarNovoPostSupervisor(dto: CreatePostSupervisorDto)
criarNovoPostResident(dto: CreatePostResidentDto)
```

### **Atualização de Entidades**

```typescript
// Padrão: update[Entity]
updateUser(id: string, updateUserDto: UpdateUserDto)
updateCompany(id: string, updateCompanyDto: UpdateCompanyDto)
updatePost(id: string, updatePostDto: UpdatePostDto)
updateUserStatus(id: string, status: boolean)
updateUserRole(id: string, role: Roles)
```

### **Exclusão e Desativação**

```typescript
// Padrão: [action][Entity]
desativarUser(id: string)
reativarUser(id: string)
deleteUserPermanentemente(id: string)
removerUserDoSistema(id: string)
```

### **Construção de Queries**

```typescript
// Padrão: construir[What]Para[Action]
construirWhereClauseParaRead(extra?: Prisma.UserWhereInput)
construirWhereClauseParaUpdate(id: string)
construirWhereClauseParaCreate()
construirWhereClauseParaDelete(id: string)
construirWhereClauseComPermissao(action: string, extra?: Prisma.UserWhereInput)
```

### **Preparação de Dados**

```typescript
// Padrão: preparar[What]Para[Action]
prepararDadosParaUpdate(updateUserDto: UpdateUserDto)
prepararDadosParaCreate(createUserDto: CreateUserDto)
prepararRelatorioParaExport(dados: any[])
prepararDadosParaValidacao(dados: any)
```

### **Validação de Resultados**

```typescript
// Padrão: validar[What]
validarResultadoDaBusca(result: any, entity: string, identifier: string, value: string)
validarDadosDeEntrada(dados: any)
validarFormatoDoEmail(email: string)
validarFormatoDoCPF(cpf: string)
validarFormatoDoPhone(phone: string)
```

### **Cálculos e Processamento**

```typescript
// Padrão: calcular[What]
calcularInformacoesDePaginacao(page: number, limit: number, total: number)
calcularEstatisticasDaCompany(companyId: string)
calcularMetricasDeUso(periodo: DateRange)
calcularTotalDeUsers(where: Prisma.UserWhereInput)
```

## 🗄️ Repository Patterns

### **Operações Básicas**

```typescript
// Busca
buscarMuitosUsers(where: Prisma.UserWhereInput, options?: { skip?: number; take?: number })
buscarPrimeiroUser(where: Prisma.UserWhereInput)
buscarUserUnico(where: Prisma.UserWhereUniqueInput)
buscarUserComRelations(id: string)

// Criação e Atualização
criarNovoUser(data: Prisma.UserCreateInput)
updateUserExistente(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput)
deleteUserPermanentemente(where: Prisma.UserWhereUniqueInput)

// Contagem e Relacionamentos
contarQuantidadeDeUsers(where: Prisma.UserWhereInput)
conectarUserAosPosts(userId: string, postIds: string[])
```

## 🔐 Permission Patterns

### **Validação de Permissões**

```typescript
// Básicas
validarSePodeExecutarAction(action: string)
validarPermissionsDosFields(updateData: any)

// Por Role
validarSePodeCriarUserComRole(targetRole: Roles)
validarSePodeUpdateUserComRole(targetRole: Roles)
validarSePodeDeleteUserComRole(targetRole: Roles)
validarOperationDoUser(action: string, targetRole: Roles)

// Utilitários
extrairFieldsPermitidosDasRules(rules: any[])
validarSePodeExecutarActionComRole(action: string, targetRole: Roles)
```

## 🏭 Factory Patterns

### **Criação de Entidades**

```typescript
// Users
criarNovoPlatformAdmin(dto: CreatePlatformAdminDto)
criarNovoAdmin(dto: CreateAdminDto)
criarNovoSupervisor(dto: CreateSupervisorDto)
criarNovoGuard(dto: CreateGuardDto)
criarNovoHR(dto: CreateHRDto)
criarNovoPostSupervisor(dto: CreatePostSupervisorDto)
criarNovoPostResident(dto: CreatePostResidentDto)

// Utilitários
hashPasswordDoUser(password: string)
```

## ✅ Validator Patterns

### **Validações de Negócio**

```typescript
// Unicidade
validarSeEmailEhUnico(email: string, excludeUserId?: string)
validarSeCPFEhUnico(cpf: string, excludeUserId?: string)
validarSePhoneEhUnico(phone: string, excludeUserId?: string)

// Existência
validarSeCompanyExiste(companyId: string)
validarSePostPertenceACompany(postId: string, companyId: string)
validarSeUserExiste(id: string)

// Regras de Negócio
validarSeUserPodeSerDeletado(id: string)
validarSeUserPodeSerAtualizado(id: string)
validarSeUserPodeSerCriado(dados: any)
```

## 🎮 Controller Patterns

### **Endpoints REST**

```typescript
// Busca
@Get() obterTodosOsUsers(@Query('page') page: string, @Query('limit') limit: string)
@Get(':id') obterUserPorId(@Param('id') id: string)
@Get('company/:companyId') obterUsersPorCompany(@Param('companyId') companyId: string)

// Criação
@Post('platform-admin') criarNovoPlatformAdmin(@Body() dto: CreatePlatformAdminDto)
@Post('admin') criarNovoAdmin(@Body() dto: CreateAdminDto)
@Post('supervisor') criarNovoSupervisor(@Body() dto: CreateSupervisorDto)
@Post('guard') criarNovoGuard(@Body() dto: CreateGuardDto)
@Post('hr') criarNovoHR(@Body() dto: CreateHRDto)
@Post('post-supervisor') criarNovoPostSupervisor(@Body() dto: CreatePostSupervisorDto)
@Post('post-resident') criarNovoPostResident(@Body() dto: CreatePostResidentDto)

// Atualização e Exclusão
@Patch(':id') updateDadosDoUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto)
@Delete(':id') removeUserDoSistema(@Param('id') id: string)
@Post(':id/restore') restoreUserDeletado(@Param('id') id: string)
```

## 📊 Exemplos de Implementação Completa

### **Exemplo 1: Busca de Usuário**

```typescript
async buscarUserPorId(id: string) {
  this.validarPermissaoParaRead();
  const whereClause = this.construirWhereClauseComPermissao('read', { id });
  const user = await this.userRepository.buscarPrimeiroUser(whereClause);
  return this.validarResultadoDaBusca(user, 'User', 'id', id);
}
```

### **Exemplo 2: Atualização de Usuário**

```typescript
async updateUser(id: string, updateUserDto: UpdateUserDto) {
  this.validarPermissaoParaUpdate();
  const whereClause = this.construirWhereClauseComPermissao('update', { id });
  const user = await this.userRepository.buscarPrimeiroUser(whereClause);
  this.validarResultadoDaBusca(user, 'User', 'id', id);
  
  const dadosParaUpdate = this.prepararDadosParaUpdate(updateUserDto);
  this.userPermissionService.validarPermissionsDosFields(dadosParaUpdate);
  
  return this.userRepository.updateUserExistente({ id }, dadosParaUpdate);
}
```

### **Exemplo 3: Criação de Admin**

```typescript
async criarNovoAdmin(dto: CreateAdminDto) {
  await this.validarPermissaoParaCreate();
  
  await this.validarSeEmailEhUnico(dto.email);
  if (dto.companyId) await this.validarSeCompanyExiste(dto.companyId);
  if (dto.cpf) await this.validarSeCPFEhUnico(dto.cpf);
  if (dto.phone) await this.validarSePhoneEhUnico(dto.phone);
  
  const dadosDoUser = this.userFactory.criarNovoAdmin(dto);
  const user = await this.userRepository.criarNovoUser(dadosDoUser);
  
  return user;
}
```

## ❌ Anti-Patterns (Evitar)

### **Mistura de Idiomas**

```typescript
// ❌ Incorreto
buscarUsuarioPorId(id) // "Usuario" deveria ser "User"
validarSeEmpresaExiste(companyId) // "Empresa" deveria ser "Company"
findUserById(id) // Método em inglês
createNewUser(dto) // Método em inglês
```

### **Nomes Genéricos**

```typescript
// ❌ Incorreto
getAll() // Deveria ser buscarTodosOsUsers()
update() // Deveria ser updateUser()
validate() // Deveria ser validarSeUserExiste()
create() // Deveria ser criarNovoUser()
```

### **Inconsistência de Padrões**

```typescript
// ❌ Incorreto
findUserById() // Deveria ser buscarUserPorId()
validateUserExists() // Deveria ser validarSeUserExiste()
createUser() // Deveria ser criarNovoUser()
updateUserData() // Deveria ser updateUser()
```

## 🔄 Checklist de Validação

### **Antes de Commitar:**

- [ ] Todos os métodos seguem padrões estabelecidos
- [ ] Entidades estão em inglês
- [ ] Métodos estão em português literal
- [ ] Propriedades estão em inglês
- [ ] Nomes são auto-explicativos
- [ ] Não há mistura inconsistente de idiomas
- [ ] Padrões são consistentes em todo o arquivo

### **Durante Code Review:**

- [ ] Verificar se nomes seguem convenções
- [ ] Confirmar que entidades estão em inglês
- [ ] Validar que métodos estão em português
- [ ] Checar consistência de padrões
- [ ] Sugerir melhorias se necessário

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0  
**Responsável**: Equipe de Desenvolvimento AUMIGOPET
