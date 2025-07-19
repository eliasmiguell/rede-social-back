-- Seeder: 003_seed_comments.sql
-- Descrição: Insere comentários de teste no sistema

INSERT INTO coments (coment_desc, coment_userid, postid) VALUES
('Que viagem incrível! Onde você foi? 😍', 2, 1),
('Adorei as fotos! Parece que foi muito divertido 🌟', 3, 1),
('Café da manhã perfeito mesmo! 😋', 1, 2),
('Que delícia! Qual é a receita? 👨‍🍳', 4, 2),
('Parabéns pelo projeto! Ficou muito bom 🚀', 1, 3),
('Que legal! Qual tecnologia você está usando? 💻', 5, 3),
('O parque está lindo! Qual parque é esse? 🌳', 2, 4),
('Natureza é sempre uma boa escolha! 🌸', 3, 4),
('Vou viajar! Muito animado 😊', 1, 5),
('Vou ficar em casa assistindo filmes 🎬', 2, 5),
('Que receita é essa? Ficou linda! 👨‍🍳', 3, 6),
('Adorei a foto! Parece delicioso 😋', 4, 6),
('Eu também amo música! 🎵', 1, 7),
('Qual gênero você mais gosta? 🎶', 3, 7),
('Parabéns pela disciplina! 💪', 2, 8),
('Exercício é fundamental! 👏', 4, 8),
('Qual livro você está lendo? 📚', 1, 9),
('Recomendações são sempre bem-vindas! 📖', 5, 9),
('Pizza caseira é sempre melhor! 🍕', 2, 10),
('Que delícia! Qual é a receita da massa? 👨‍🍳', 3, 10)
ON CONFLICT DO NOTHING; 