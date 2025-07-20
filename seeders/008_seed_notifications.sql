-- Seeder: 008_seed_notifications.sql
-- Descrição: Inserir dados de teste para notificações

INSERT INTO notifications (user_id, from_user_id, notification_type, reference_id, message, is_read, created_at) VALUES
-- Notificações de seguir
(2, 1, 'follow', NULL, 'João Silva começou a seguir você', FALSE, NOW() - INTERVAL '2 hours'),
(3, 1, 'follow', NULL, 'João Silva começou a seguir você', TRUE, NOW() - INTERVAL '1 day'),
(1, 2, 'follow', NULL, 'Maria Santos começou a seguir você', FALSE, NOW() - INTERVAL '30 minutes'),

-- Notificações de curtir (quando implementarmos)
(1, 2, 'like', 1, 'Maria Santos curtiu sua publicação', FALSE, NOW() - INTERVAL '1 hour'),
(1, 3, 'like', 1, 'Pedro Costa curtiu sua publicação', TRUE, NOW() - INTERVAL '3 hours'),

-- Notificações de comentário (quando implementarmos)
(1, 2, 'comment', 1, 'Maria Santos comentou em sua publicação', FALSE, NOW() - INTERVAL '45 minutes'),
(2, 1, 'comment', 2, 'João Silva comentou em sua publicação', TRUE, NOW() - INTERVAL '2 days'); 