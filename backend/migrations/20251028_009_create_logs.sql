-- Criar tabela logs

CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rota VARCHAR(255),
    metodo VARCHAR(10),
    ip_address VARCHAR(50),
    user_agent TEXT,
    dados_requisicao TEXT,
    dados_resposta TEXT,
    status_code INT,
    tempo_resposta_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
