-- Migration: 002_create_posts_table.sql
-- Descrição: Cria a tabela de posts

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    post_desc TEXT,
    img VARCHAR(500),
    userid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_posts_userid ON posts(userid);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at); 