-- Migration: 009_create_notifications_table.sql
-- Descrição: Cria a tabela de notificações para diferentes tipos de eventos

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    from_user_id INTEGER NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    reference_id INTEGER,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_from_user_id ON notifications(from_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Comentários explicativos
COMMENT ON TABLE notifications IS 'Tabela para armazenar notificações de diferentes tipos (seguir, curtir, comentar, etc.)';
COMMENT ON COLUMN notifications.notification_type IS 'Tipo da notificação: follow, like, comment, etc.';
COMMENT ON COLUMN notifications.reference_id IS 'ID de referência (post_id, comment_id, etc.) dependendo do tipo';
COMMENT ON COLUMN notifications.message IS 'Mensagem da notificação'; 