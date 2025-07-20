-- Migration: 008_alter_posts_img_column.sql
-- Descrição: Altera o tipo da coluna img na tabela posts de VARCHAR(500) para TEXT

-- Alterar o tipo da coluna img para TEXT
ALTER TABLE posts ALTER COLUMN img TYPE TEXT;

-- Comentário explicativo
COMMENT ON COLUMN posts.img IS 'URL da imagem do post - tipo TEXT para suportar URLs mais longas'; 