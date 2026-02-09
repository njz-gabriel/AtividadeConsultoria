-- Criar tabela Treinamentos

CREATE TABLE IF NOT EXISTS treinamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    duracao_horas INT NOT NULL,
    capacidade INT NOT NULL,

    instrutor_id INT NOT NULL,

    modalidade VARCHAR(50) NOT NULL,
    local_plataforma VARCHAR(150),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,

    pre_requisitos TEXT,
    sobre TEXT,
    objetivos TEXT,

    status VARCHAR(50) DEFAULT 'Rascunho',
    inscritos_atuais INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (instrutor_id) REFERENCES instrutores(id)
);
