# API Rede Social

API backend para uma rede social desenvolvida com Node.js, Express e PostgreSQL.

## 🚀 Funcionalidades

- Autenticação de usuários (registro/login)
- Posts com texto e imagens
- Sistema de comentários
- Sistema de likes
- Relacionamentos de amizade/seguidores
- Sistema de mensagens privadas
- Notificações
- Upload de imagens
- Busca de usuários e posts

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas
- **multer** - Upload de arquivos

## 📋 Pré-requisitos

- Node.js 22.x
- PostgreSQL
- npm ou yarn

## ⚙️ Configuração

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd api-redes-sociais
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```
Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
TOKEN=seu_token_secreto_aqui
REFRESH=seu_refresh_token_secreto_aqui
PORT=8000
```

4. **Configure o banco de dados**
- Crie um banco PostgreSQL
- Configure as credenciais no arquivo `.env`

## 🗄️ Sistema de Migrations

O projeto inclui um sistema automático de migrations que cria todas as tabelas necessárias.

### Execução Automática
As migrations são executadas automaticamente quando o servidor é iniciado:
```bash
npm start
```

### Comandos de Migration

```bash
# Executar migrations manualmente
npm run migrate

# Verificar status das migrations
npm run migrate:status

# Iniciar servidor em modo desenvolvimento
npm run dev
```

### Estrutura do Banco

O sistema cria automaticamente as seguintes tabelas:
- **users** - Usuários do sistema
- **posts** - Posts dos usuários
- **coments** - Comentários nos posts
- **likes** - Likes nos posts
- **friendship** - Relacionamentos de amizade
- **conversations** - Conversas entre usuários
- **messages** - Mensagens nas conversas

## 🚀 Executando o Projeto

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em `http://localhost:8000`

## 📚 Documentação da API

### Endpoints Principais

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/users/` - Buscar usuário por ID
- `POST /api/post/` - Criar post
- `GET /api/post/` - Buscar posts
- `POST /api/coment/` - Criar comentário
- `GET /api/coment/` - Buscar comentários
- `POST /api/like/` - Adicionar like
- `DELETE /api/like/` - Remover like
- `POST /api/friendship/` - Seguir usuário
- `DELETE /api/friendship/` - Deixar de seguir
- `GET /api/friendship/` - Listar seguidores
- `POST /api/conversation/` - Criar conversa
- `GET /api/conversation/` - Listar conversas
- `POST /api/messagens/` - Enviar mensagem
- `GET /api/notifications/` - Buscar notificações
- `GET /api/search/user` - Buscar usuários
- `GET /api/search/post` - Buscar posts

## 🔧 Desenvolvimento

### Adicionando Novas Migrations

1. Crie um arquivo `.sql` na pasta `migrations/`
2. Use o padrão: `XXX_descricao_tabela.sql`
3. A migration será executada automaticamente na próxima inicialização

### Estrutura do Projeto

```
api-redes-sociais/
├── controllers/     # Lógica de negócio
├── middleware/      # Middlewares (auth, validação)
├── migrations/      # Sistema de migrations
├── routes/          # Rotas da API
├── connect.js       # Conexão com banco
├── index.js         # Servidor principal
└── package.json
```

## 📝 Licença

Este projeto está sob a licença ISC. 