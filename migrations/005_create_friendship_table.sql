-- Migration: 005_create_friendship_table.sql
-- Descrição: Cria a tabela de relacionamentos de amizade/seguidores

CREATE TABLE IF NOT EXISTS friendship (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(follower_id, followed_id) -- Evita seguir o mesmo usuário múltiplas vezes
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_friendship_follower ON friendship(follower_id);
CREATE INDEX IF NOT EXISTS idx_friendship_followed ON friendship(followed_id); 