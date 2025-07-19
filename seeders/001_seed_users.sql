-- Seeder: 001_seed_users.sql
-- Descrição: Insere usuários de teste no sistema

-- Senha: 123456 (hash bcrypt)
INSERT INTO users (username, email, password, userimg, bgimg) VALUES
('João Silva', 'joao@teste.com', '$2b$08$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'),
('Maria Santos', 'maria@teste.com', '$2b$08$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop'),
('Pedro Costa', 'pedro@teste.com', '$2b$08$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'),
('Ana Oliveira', 'ana@teste.com', '$2b$08$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop'),
('Carlos Lima', 'carlos@teste.com', '$2b$08$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop')
ON CONFLICT (email) DO NOTHING; 