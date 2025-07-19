-- Seeder: 002_seed_posts.sql
-- Descrição: Insere posts de teste no sistema

INSERT INTO posts (post_desc, img, userid) VALUES
('Olá pessoal! Acabei de chegar de uma viagem incrível! 🌍✈️', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', 1),
('Café da manhã perfeito para começar o dia! ☕🥐', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop', 2),
('Trabalhando em um novo projeto hoje. Muito empolgado com os resultados! 💻🚀', NULL, 3),
('Passeio no parque foi maravilhoso! A natureza é incrível 🌳🌸', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', 4),
('Final de semana chegando! Quais são os planos de vocês? 😊', NULL, 5),
('Receita nova que aprendi hoje. Ficou uma delícia! 👨‍🍳', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop', 1),
('Música é vida! 🎵 Qual é a playlist de vocês hoje?', NULL, 2),
('Exercício matinal feito! Energia para o dia todo 💪', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', 3),
('Lendo um livro incrível. Recomendo muito! 📚', NULL, 4),
('Pizza caseira de hoje! Melhor que delivery 🍕', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop', 5)
ON CONFLICT DO NOTHING; 