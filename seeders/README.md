# Sistema de Seeders (Dados de Teste)

Este diretório contém o sistema de seeders para criar automaticamente dados de teste no banco de dados.

## Como Funciona

O sistema de seeders é executado automaticamente após as migrations quando o servidor é iniciado. Ele:

1. Cria uma tabela `seeders` para controlar quais seeders já foram executados
2. Executa todos os seeders `.sql` na ordem alfabética
3. Marca cada seeder como executado após sucesso
4. Pula seeders que já foram executados

## Estrutura dos Seeders

Os seeders são numerados sequencialmente para garantir a ordem correta:

- `001_seed_users.sql` - Usuários de teste
- `002_seed_posts.sql` - Posts de teste
- `003_seed_comments.sql` - Comentários de teste
- `004_seed_likes.sql` - Likes de teste
- `005_seed_friendships.sql` - Relacionamentos de amizade
- `006_seed_conversations.sql` - Conversas de teste
- `007_seed_messages.sql` - Mensagens de teste

## Comandos Disponíveis

```bash
# Executar seeders manualmente
npm run seed

# Verificar status dos seeders
npm run seed:status

# Iniciar servidor (executa migrations e seeders automaticamente)
npm start

# Iniciar servidor em modo desenvolvimento
npm run dev
```

## Execução Automática

Os seeders são executados automaticamente quando:
- O servidor é iniciado com `npm start`
- O servidor é iniciado em modo desenvolvimento com `npm run dev`

## Dados de Teste Criados

### 👥 Usuários (5 usuários)
- **João Silva** (joao@teste.com) - Senha: 123456
- **Maria Santos** (maria@teste.com) - Senha: 123456
- **Pedro Costa** (pedro@teste.com) - Senha: 123456
- **Ana Oliveira** (ana@teste.com) - Senha: 123456
- **Carlos Lima** (carlos@teste.com) - Senha: 123456

### 📝 Posts (10 posts)
- Posts com texto e imagens
- Posts apenas com texto
- Distribuídos entre os 5 usuários

### 💬 Comentários (20 comentários)
- Comentários em todos os posts
- Interação entre usuários

### ❤️ Likes (40 likes)
- Todos os usuários deram like em todos os posts
- Demonstra funcionalidade de curtidas

### 👥 Relacionamentos (20 relacionamentos)
- Todos os usuários seguem uns aos outros
- Rede social completamente conectada

### 💬 Conversas (10 conversas)
- Conversas entre diferentes pares de usuários
- Demonstra funcionalidade de mensagens

### 💌 Mensagens (15 mensagens)
- Mensagens em diferentes conversas
- Algumas marcadas como não lidas

## Adicionando Novos Seeders

Para adicionar um novo seeder:

1. Crie um arquivo `.sql` na pasta `seeders/`
2. Use o padrão de nomenclatura: `XXX_descricao_dados.sql`
3. O arquivo será executado automaticamente na próxima inicialização do servidor

## Credenciais de Teste

Para testar o sistema, use qualquer uma das credenciais:

```
Email: joao@teste.com
Senha: 123456

Email: maria@teste.com
Senha: 123456

Email: pedro@teste.com
Senha: 123456

Email: ana@teste.com
Senha: 123456

Email: carlos@teste.com
Senha: 123456
```

## Benefícios

- ✅ **Dados prontos para teste** - Não precisa criar dados manualmente
- ✅ **Demonstração completa** - Todas as funcionalidades podem ser testadas
- ✅ **Desenvolvimento rápido** - Foco no desenvolvimento, não na criação de dados
- ✅ **Testes consistentes** - Mesmos dados em todos os ambientes 