# Sistema de Migrations

Este diretório contém o sistema de migrations para criar automaticamente as tabelas do banco de dados.

## Como Funciona

O sistema de migrations é executado automaticamente quando o servidor é iniciado. Ele:

1. Cria uma tabela `migrations` para controlar quais migrations já foram executadas
2. Executa todas as migrations `.sql` na ordem alfabética
3. Marca cada migration como executada após sucesso
4. Pula migrations que já foram executadas

## Estrutura das Migrations

As migrations são numeradas sequencialmente para garantir a ordem correta:

- `001_create_users_table.sql` - Tabela de usuários
- `002_create_posts_table.sql` - Tabela de posts
- `003_create_coments_table.sql` - Tabela de comentários
- `004_create_likes_table.sql` - Tabela de likes
- `005_create_friendship_table.sql` - Tabela de relacionamentos
- `006_create_conversations_table.sql` - Tabela de conversas
- `007_create_messages_table.sql` - Tabela de mensagens

## Comandos Disponíveis

```bash
# Executar migrations manualmente
npm run migrate

# Iniciar servidor (executa migrations automaticamente)
npm start

# Iniciar servidor em modo desenvolvimento
npm run dev
```

## Execução Automática

As migrations são executadas automaticamente quando:
- O servidor é iniciado com `npm start`
- O servidor é iniciado em modo desenvolvimento com `npm run dev`

## Adicionando Novas Migrations

Para adicionar uma nova migration:

1. Crie um arquivo `.sql` na pasta `migrations/`
2. Use o padrão de nomenclatura: `XXX_descricao_tabela.sql`
3. O arquivo será executado automaticamente na próxima inicialização do servidor

## Estrutura do Banco de Dados

### Tabela: users
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR(255) UNIQUE)
- `email` (VARCHAR(255) UNIQUE)
- `password` (VARCHAR(255))
- `userimg` (VARCHAR(500))
- `bgimg` (VARCHAR(500))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: posts
- `id` (SERIAL PRIMARY KEY)
- `post_desc` (TEXT)
- `img` (VARCHAR(500))
- `userid` (INTEGER - FK para users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: coments
- `id` (SERIAL PRIMARY KEY)
- `coment_desc` (TEXT)
- `coment_userid` (INTEGER - FK para users)
- `postid` (INTEGER - FK para posts)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: likes
- `id` (SERIAL PRIMARY KEY)
- `likes_userid` (INTEGER - FK para users)
- `likes_postid` (INTEGER - FK para posts)
- `created_at` (TIMESTAMP)

### Tabela: friendship
- `id` (SERIAL PRIMARY KEY)
- `follower_id` (INTEGER - FK para users)
- `followed_id` (INTEGER - FK para users)
- `created_at` (TIMESTAMP)

### Tabela: conversations
- `id` (SERIAL PRIMARY KEY)
- `user1_id` (INTEGER - FK para users)
- `user2_id` (INTEGER - FK para users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: messages
- `id` (SERIAL PRIMARY KEY)
- `conversations` (INTEGER - FK para conversations)
- `sender_id` (INTEGER - FK para users)
- `recipient_id` (INTEGER - FK para users)
- `messages` (TEXT)
- `is_read` (BOOLEAN)
- `sent_at` (TIMESTAMP)

## Relacionamentos

- **users** → **posts** (1:N)
- **users** → **coments** (1:N)
- **users** → **likes** (1:N)
- **users** → **friendship** (1:N - follower/followed)
- **users** → **conversations** (1:N - user1/user2)
- **users** → **messages** (1:N - sender/recipient)
- **posts** → **coments** (1:N)
- **posts** → **likes** (1:N)
- **conversations** → **messages** (1:N) 