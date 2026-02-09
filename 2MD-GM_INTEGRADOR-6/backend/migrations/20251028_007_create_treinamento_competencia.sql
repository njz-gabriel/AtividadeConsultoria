-- Criar tabela treinamento_competencia

CREATE TABLE IF NOT EXISTS treinamento_competencia (
    treinamento_id INT NOT NULL,
    competencia_id INT NOT NULL,
    PRIMARY KEY (treinamento_id, competencia_id),

    FOREIGN KEY (treinamento_id) REFERENCES treinamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (competencia_id) REFERENCES competencias(id)
);
