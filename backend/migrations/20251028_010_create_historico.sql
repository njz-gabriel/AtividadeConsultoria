-- Criar tabela Histórico

CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    acao VARCHAR(255) NOT NULL,
    descricao TEXT,
    usuario_id INT NULL,
    datahora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX (usuario_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
