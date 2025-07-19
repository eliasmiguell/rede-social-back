-- Seeder: 006_seed_conversations.sql
-- Descrição: Insere conversas de teste no sistema

INSERT INTO conversations (user1_id, user2_id) VALUES
-- Conversas entre João e outros usuários
(1, 2), (1, 3), (1, 4), (1, 5),
-- Conversas entre Maria e outros usuários
(2, 3), (2, 4), (2, 5),
-- Conversas entre Pedro e outros usuários
(3, 4), (3, 5),
-- Conversa entre Ana e Carlos
(4, 5)
ON CONFLICT (user1_id, user2_id) DO NOTHING; 