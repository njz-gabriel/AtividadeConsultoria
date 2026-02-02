-- D) Ligar Cursos às Competências (Exemplos)
-- Curso 1 (Agil) -> Agilidade(1), Gestão(2)
INSERT INTO treinamento_competencia (treinamento_id, competencia_id) VALUES (1, 1), (1, 2);
-- Curso 2 (Segurança Info) -> Tecnologia(3)
INSERT INTO treinamento_competencia (treinamento_id, competencia_id) VALUES (2, 3);
-- Curso 3 (Alta Tensão) -> Segurança(7), Tecnologia(3)
INSERT INTO treinamento_competencia (treinamento_id, competencia_id) VALUES (3, 7), (3, 3);