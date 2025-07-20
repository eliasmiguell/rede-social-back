-- Migration: 010_add_status_to_friendship.sql
-- Descrição: Adiciona campo de status na tabela friendship para controlar solicitações

-- Adicionar coluna status com valores padrão
ALTER TABLE friendship ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Atualizar registros existentes para 'accepted'
UPDATE friendship SET status = 'accepted' WHERE status IS NULL;

-- Adicionar constraint para valores válidos
ALTER TABLE friendship ADD CONSTRAINT check_friendship_status 
CHECK (status IN ('pending', 'accepted', 'rejected'));

-- Criar índice para melhor performance nas consultas por status
CREATE INDEX IF NOT EXISTS idx_friendship_status ON friendship(status);
CREATE INDEX IF NOT EXISTS idx_friendship_followed_status ON friendship(followed_id, status);

-- Comentários explicativos
COMMENT ON COLUMN friendship.status IS 'Status da solicitação: pending (pendente), accepted (aceita), rejected (rejeitada)'; 