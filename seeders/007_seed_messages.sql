-- Seeder: 007_seed_messages.sql
-- Descrição: Insere mensagens de teste no sistema

INSERT INTO messages (conversations, sender_id, recipient_id, messages, is_read) VALUES
-- Conversa entre João (1) e Maria (2) - conversation_id = 1
(1, 1, 2, 'Oi Maria! Como você está? 😊', false),
(1, 2, 1, 'Oi João! Tudo bem sim, e você? 😊', false),
(1, 1, 2, 'Tudo ótimo! Vi seu post sobre o café da manhã, ficou lindo!', false),
(1, 2, 1, 'Obrigada! Ficou uma delícia mesmo ☕', false),

-- Conversa entre João (1) e Pedro (3) - conversation_id = 2
(2, 1, 3, 'Oi Pedro! Como está o projeto? 🚀', false),
(2, 3, 1, 'Oi João! Está indo muito bem, obrigado por perguntar! 💻', false),
(2, 1, 3, 'Que legal! Se precisar de ajuda, pode contar comigo', false),

-- Conversa entre Maria (2) e Ana (4) - conversation_id = 5
(5, 2, 4, 'Oi Ana! Adorei suas fotos do parque! 🌳', false),
(5, 4, 2, 'Oi Maria! Obrigada! Foi um passeio incrível 🌸', false),
(5, 2, 4, 'Precisamos marcar um passeio juntas!', false),
(5, 4, 2, 'Claro! Seria muito legal! 😊', false),

-- Conversa entre Pedro (3) e Carlos (5) - conversation_id = 7
(7, 3, 5, 'Oi Carlos! Como estão os planos do final de semana? 😊', false),
(7, 5, 3, 'Oi Pedro! Vou fazer uma pizza caseira! 🍕', false),
(7, 3, 5, 'Que delícia! Manda foto depois!', false),

-- Conversa entre Ana (4) e Carlos (5) - conversation_id = 8
(8, 4, 5, 'Oi Carlos! Qual livro você está lendo? 📚', false),
(8, 5, 4, 'Oi Ana! Estou lendo um romance muito bom!', false),
(8, 4, 5, 'Que legal! Depois me conta mais sobre ele', false)
ON CONFLICT DO NOTHING; 