-- Migration: 004_create_likes_table.sql
-- Descrição: Cria a tabela de likes

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    likes_userid INTEGER NOT NULL,
    likes_postid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (likes_userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (likes_postid) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE(likes_userid, likes_postid) -- Evita likes duplicados
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_likes_postid ON likes(likes_postid);
CREATE INDEX IF NOT EXISTS idx_likes_userid ON likes(likes_userid); 