-- Seeder: 010_seed_mutual_friendships.sql
-- Descrição: Inserir dados de teste para conexões mútuas

-- Limpar dados existentes para testar o novo sistema
DELETE FROM friendship;

-- Inserir conexões mútuas aceitas
INSERT INTO friendship (follower_id, followed_id, status, created_at) VALUES
-- Usuário 1 e 2 seguem um ao outro (conexão mútua)
(1, 2, 'accepted', NOW() - INTERVAL '2 days'),
(2, 1, 'accepted', NOW() - INTERVAL '2 days'),

-- Usuário 1 e 3 seguem um ao outro (conexão mútua)
(1, 3, 'accepted', NOW() - INTERVAL '1 day'),
(3, 1, 'accepted', NOW() - INTERVAL '1 day'),

-- Usuário 2 e 4 seguem um ao outro (conexão mútua)
(2, 4, 'accepted', NOW() - INTERVAL '12 hours'),
(4, 2, 'accepted', NOW() - INTERVAL '12 hours'),

-- Algumas solicitações pendentes
(3, 4, 'pending', NOW() - INTERVAL '2 hours'),
(4, 1, 'pending', NOW() - INTERVAL '1 hour'),

-- Algumas solicitações rejeitadas
(3, 5, 'rejected', NOW() - INTERVAL '3 hours'),
(5, 2, 'rejected', NOW() - INTERVAL '2 hours'); 