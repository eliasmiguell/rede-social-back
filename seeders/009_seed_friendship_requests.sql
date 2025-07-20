-- Seeder: 009_seed_friendship_requests.sql
-- Descrição: Inserir dados de teste para solicitações de amizade

-- Atualizar ou inserir solicitações pendentes
INSERT INTO friendship (follower_id, followed_id, status, created_at) VALUES
-- Usuário 1 enviou solicitação para usuário 2 (pendente)
(1, 2, 'pending', NOW() - INTERVAL '2 hours'),

-- Usuário 3 enviou solicitação para usuário 1 (pendente)
(3, 1, 'pending', NOW() - INTERVAL '1 hour'),

-- Usuário 2 enviou solicitação para usuário 3 (pendente)
(2, 3, 'pending', NOW() - INTERVAL '30 minutes'),

-- Algumas amizades aceitas para teste
(1, 4, 'accepted', NOW() - INTERVAL '1 day'),
(4, 1, 'accepted', NOW() - INTERVAL '1 day'),

-- Algumas solicitações rejeitadas
(2, 4, 'rejected', NOW() - INTERVAL '3 hours'),
(3, 4, 'rejected', NOW() - INTERVAL '2 hours')

ON CONFLICT (follower_id, followed_id) 
DO UPDATE SET 
  status = EXCLUDED.status,
  created_at = EXCLUDED.created_at; 