-- Seeder: 004_seed_likes.sql
-- Descrição: Insere likes de teste no sistema

INSERT INTO likes (likes_userid, likes_postid) VALUES
-- Likes no post 1 (João - Viagem)
(2, 1), (3, 1), (4, 1), (5, 1),
-- Likes no post 2 (Maria - Café)
(1, 2), (3, 2), (4, 2), (5, 2),
-- Likes no post 3 (Pedro - Projeto)
(1, 3), (2, 3), (4, 3), (5, 3),
-- Likes no post 4 (Ana - Parque)
(1, 4), (2, 4), (3, 4), (5, 4),
-- Likes no post 5 (Carlos - Final de semana)
(1, 5), (2, 5), (3, 5), (4, 5),
-- Likes no post 6 (João - Receita)
(2, 6), (3, 6), (4, 6), (5, 6),
-- Likes no post 7 (Maria - Música)
(1, 7), (3, 7), (4, 7), (5, 7),
-- Likes no post 8 (Pedro - Exercício)
(1, 8), (2, 8), (4, 8), (5, 8),
-- Likes no post 9 (Ana - Livro)
(1, 9), (2, 9), (3, 9), (5, 9),
-- Likes no post 10 (Carlos - Pizza)
(1, 10), (2, 10), (3, 10), (4, 10)
ON CONFLICT (likes_userid, likes_postid) DO NOTHING; 