-- Seeder: 005_seed_friendships.sql
-- Descrição: Insere relacionamentos de amizade de teste no sistema

INSERT INTO friendship (follower_id, followed_id) VALUES
-- João segue todos
(1, 2), (1, 3), (1, 4), (1, 5),
-- Maria segue todos
(2, 1), (2, 3), (2, 4), (2, 5),
-- Pedro segue todos
(3, 1), (3, 2), (3, 4), (3, 5),
-- Ana segue todos
(4, 1), (4, 2), (4, 3), (4, 5),
-- Carlos segue todos
(5, 1), (5, 2), (5, 3), (5, 4)
ON CONFLICT (follower_id, followed_id) DO NOTHING; 