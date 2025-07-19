-- Migration: 003_create_coments_table.sql
-- Descrição: Cria a tabela de comentários

CREATE TABLE IF NOT EXISTS coments (
    id SERIAL PRIMARY KEY,
    coment_desc TEXT NOT NULL,
    coment_userid INTEGER NOT NULL,
    postid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coment_userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (postid) REFERENCES posts(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_coments_postid ON coments(postid);
CREATE INDEX IF NOT EXISTS idx_coments_userid ON coments(coment_userid);
CREATE INDEX IF NOT EXISTS idx_coments_created_at ON coments(created_at); 