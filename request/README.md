# 📋 Arquivos de Requisições HTTP - AumigoPet API

Este diretório contém todos os arquivos `.http` para testar os endpoints da API AumigoPet.

## 📁 Arquivos Disponíveis (16 arquivos)

### 🔐 Autenticação e Configuração
1. **`auth.http`** (6.6KB) - Autenticação, login, registro, refresh token

### 📦 Módulos Principais

2. **`pets.http`** (11KB) - CRUD de Pets
   - Criar pets (cachorro, gato, outros)
   - Buscar, atualizar, deletar
   - Filtros por espécie, idade, etc.

3. **`vaccine-exams.http`** - Vacinas e Exames *(a ser criado)*
   - Registrar vacinas e exames
   - Histórico de vacinação
   - Status (em dia, vencido, próximo)

4. **`reminders.http`** (5.9KB) - Lembretes
   - Criar lembretes (vacina, medicação, veterinário, banho)
   - Buscar por tipo, status, pet
   - Atualizar status (pendente, concluído)

5. **`weight-records.http`** (5.5KB) - Histórico de Peso
   - Registrar peso dos pets
   - Comparar evolução
   - Status (normal, abaixo, acima)

### 📱 Rede Social

6. **`social-posts.http`** (6.5KB) - Posts Sociais
   - Criar posts (normal, adoção, perdido, patrocinado)
   - Feed de posts
   - Filtros por tipo, autor, localização

7. **`post-comments.http`** (5.1KB) - Comentários
   - Comentar em posts
   - Buscar comentários por post/autor
   - Editar/deletar comentários

8. **`post-likes.http`** (3.7KB) - Curtidas
   - Curtir/descurtir posts
   - Verificar curtidas
   - Contar curtidas por post

9. **`follows.http`** (4.2KB) - Seguir Usuários
   - Seguir/deixar de seguir
   - Listar seguidores/seguindo
   - Verificar se segue

### 🐕 Amizades entre Pets

10. **`pet-friend-requests.http`** (5.9KB) - Solicitações de Amizade
    - Enviar solicitação
    - Aceitar/rejeitar
    - Listar solicitações pendentes

11. **`pet-friendships.http`** (4.2KB) - Amizades
    - Criar amizade entre pets
    - Listar amigos do pet
    - Remover amizade

### 🏪 Serviços

12. **`service-providers.http`** (7.4KB) - Prestadores de Serviço
    - Cadastrar prestadores (veterinária, pet shop, hotel, adestrador)
    - Buscar por categoria, localização
    - Aprovar/suspender prestadores

13. **`services.http`** (6.4KB) - Serviços Oferecidos
    - Cadastrar serviços
    - Listar serviços por prestador
    - Preços, duração, disponibilidade

14. **`reviews.http`** (7.2KB) - Avaliações
    - Avaliar prestadores (1-5 estrelas)
    - Comentários
    - Calcular média de avaliações

15. **`favorites.http`** (4.2KB) - Favoritos
    - Favoritar/desfavoritar prestadores
    - Listar favoritos do usuário
    - Verificar se está favoritado

### 📁 Outros

16. **`files.http`** (5.7KB) - Upload de Arquivos
    - Upload de imagens
    - Listar arquivos
    - Download/deletar

17. **`notifications.http`** (8.4KB) - Notificações
    - Buscar notificações
    - Marcar como lida
    - Filtrar por tipo

---

## 🚀 Como Usar

### Pré-requisitos
- **VS Code** com extensão **REST Client** instalada
- Ou **IntelliJ IDEA / WebStorm** (suporte nativo)
- Ou **Postman** (importar os arquivos)

### Passo a Passo

1. **Autenticar-se primeiro** (`auth.http`):
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@aumigopet.com",
  "password": "User123@"
}
```

2. **Copiar o token** retornado

3. **Substituir a variável** `@token` no arquivo de testes:
```http
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Executar as requisições** clicando em "Send Request" acima de cada bloco

---

## 📝 Estrutura dos Arquivos

Cada arquivo segue o mesmo padrão:

```http
### =============================================================================
### CABEÇALHO COM INFORMAÇÕES DO MÓDULO
### =============================================================================

# Variáveis
@baseUrl = http://localhost:3000
@token = 
@entityId = 

### 1. AUTENTICAÇÃO
### 2. CRIAR (CREATE)
### 3. BUSCAR (READ)
### 4. ATUALIZAR (UPDATE)
### 5. DELETAR (DELETE)
### 6. TESTES DE VALIDAÇÃO (ERROS)
```

---

## 🎯 Casos de Teste Incluídos

Cada arquivo inclui testes para:

✅ **Operações CRUD básicas**
- Criar entidades
- Buscar por ID
- Listar com paginação
- Atualizar campos
- Deletar

✅ **Filtros e Buscas**
- Por status, tipo, autor
- Por data, localização
- Ordenação
- Contagem

✅ **Validações e Erros**
- Sem autenticação (401)
- Campos obrigatórios faltando (400)
- IDs inexistentes (404)
- Duplicatas (409)
- Dados inválidos (400)

---

## 🔧 Variáveis Globais

Cada arquivo usa variáveis que precisam ser preenchidas:

```http
@baseUrl = http://localhost:3000    # URL da API
@contentType = application/json      # Tipo de conteúdo
@token =                             # Token JWT (obtido no login)
@entityId =                          # ID da entidade (obtido ao criar)
```

---

## 📊 Estatísticas

- **Total de arquivos**: 16
- **Total de casos de teste**: ~200+
- **Tamanho total**: ~95KB
- **Módulos cobertos**: 14

---

## 🎨 Dicas de Uso

### VS Code (REST Client)

1. Instale a extensão: `humao.rest-client`
2. Abra qualquer arquivo `.http`
3. Clique em "Send Request" acima do bloco HTTP
4. Veja a resposta no painel lateral

### Variáveis Dinâmicas

Use `@name` para salvar respostas e reutilizar:

```http
# @name loginUser
POST {{baseUrl}}/auth/login
...

@token = {{loginUser.response.body.access_token}}
```

### Múltiplos Ambientes

Crie arquivos de ambiente:
- `dev.env` → `@baseUrl = http://localhost:3000`
- `prod.env` → `@baseUrl = https://api.aumigopet.com`

---

## ✅ Checklist de Testes

Para cada módulo novo, teste:

- [ ] Criar com sucesso
- [ ] Buscar por ID
- [ ] Listar com paginação
- [ ] Atualizar
- [ ] Deletar
- [ ] Erro 401 (sem auth)
- [ ] Erro 400 (dados inválidos)
- [ ] Erro 404 (não encontrado)

---

## 🚀 Próximos Passos

1. ✅ Criar arquivos `.http` para todos os módulos
2. ⏳ Testar todos os endpoints
3. ⏳ Documentar com Swagger/OpenAPI
4. ⏳ Criar testes automatizados (Jest/Supertest)

---

**Desenvolvido para o projeto AumigoPet** 🐶🐱

