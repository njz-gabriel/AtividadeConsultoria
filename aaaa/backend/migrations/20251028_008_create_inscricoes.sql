-- Criar tabelas inscrições

CREATE TABLE IF NOT EXISTS inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,
    treinamento_id INT NOT NULL,

    status ENUM('Inscrito', 'Cancelado', 'Concluído', 'Reprovado') 
        DEFAULT 'Inscrito',

    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP NULL,

    observacoes TEXT,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (treinamento_id) REFERENCES treinamentos(id) ON DELETE CASCADE,

    UNIQUE(usuario_id, treinamento_id)
);
