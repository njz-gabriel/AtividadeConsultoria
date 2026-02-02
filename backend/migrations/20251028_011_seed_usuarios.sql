-- Senha admin "123456"
INSERT INTO usuarios (nome, email, senha, nivel_acesso)
VALUES ('Admin', 'admin@gm.com','$2b$12$.ZSDbfYo5b1JNXoLP42iXOw9g2I.yLxOXELc2z5zR/kMcuOuFPfdy', 'Admin');

-- Outros usuários(Colaborador) com senha "123"
INSERT INTO usuarios (nome, email, senha, nivel_acesso, cargo, departamento, unidade)
VALUES
('João Silva', 'joao.silva@gm.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Desenvolvedor Junior', 'TI', 'São Caetano do Sul'),
('Ana Souza', 'ana.souza@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Analista Jr', 'RH', 'São Paulo'),
('Carlos Mendes', 'carlos.mendes@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Desenvolvedor Pleno', 'TI', 'São Paulo'),
('Juliana Lima', 'juliana.lima@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Auxiliar Administrativo', 'Administrativo', 'Rio de Janeiro'),
('Rafael Costa', 'rafael.costa@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Coordenador', 'Operações', 'Curitiba'),
('Mariana Dias', 'mariana.dias@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Analista Sr', 'Financeiro', 'São Paulo'),
('Bruno Albuquerque', 'bruno.albuquerque@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Engenheiro de Produção', 'Manufatura', 'Gravataí'),
('Camila Ferreira', 'camila.ferreira@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Analista de Qualidade', 'Qualidade', 'São Caetano'),
('Diego Martins', 'diego.martins@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Técnico de Manutenção', 'Manutenção', 'São José dos Campos'),
('Larissa Rocha', 'larissa.rocha@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Coordenadora de Projetos', 'P&D', 'São Caetano'),
('Felipe Nogueira', 'felipe.nogueira@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Operador de Logística', 'Logística', 'Gravataí'),
('Patrícia Barros', 'patricia.barros@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Especialista Financeiro', 'Financeiro', 'São Paulo'),
('Vitor Almeida', 'vitor.almeida@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Analista de Dados', 'TI', 'São José dos Campos'),
('Isabela Monteiro', 'isabela.monteiro@empresa.com','$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Assistente de RH', 'RH', 'São Paulo'),
('Gustavo Pereira', 'gustavo.pereira@empresa.com','$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Engenheiro de Segurança', 'Segurança e EHS', 'Gravataí'),
('Renata Sousa', 'renata.sousa@empresa.com', '$2b$12$fxkaA/JVxyThD4N8LOFGyeBwGRWrrB4.CJitMLDxgnuwhtGSstaga', 'Colaborador', 'Supervisora de Produção', 'Manufatura', 'São Caetano');
