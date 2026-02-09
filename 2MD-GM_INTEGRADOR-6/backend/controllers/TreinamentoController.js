import { getConnection } from '../config/database.js';
import { registrarHistorico } from "../utils/historico.js"; // IMPORTANTE

const tratarData = (data) => data && data !== '' ? data : null;

// ================================
// GET - LISTAR TREINAMENTOS
// ================================
export const listarTreinamentos = async (req, res) => {
    try {
        const conn = await getConnection();
        const sql = `
            SELECT 
                t.*, 
                i.nome AS instrutor_nome,
                i.email AS instrutor_email,
                GROUP_CONCAT(c.nome) as competencias_lista
            FROM treinamentos t
            LEFT JOIN instrutores i ON t.instrutor_id = i.id
            LEFT JOIN treinamento_competencia tc ON t.id = tc.treinamento_id
            LEFT JOIN competencias c ON tc.competencia_id = c.id
            GROUP BY t.id
            ORDER BY t.created_at DESC
        `;
        const [rows] = await conn.query(sql);
        conn.release();

        const dados = rows.map(row => ({
            ...row,
            competencias: row.competencias_lista ? row.competencias_lista.split(',') : []
        }));


        res.json({ sucesso: true, dados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar' });
    }
};

// ================================
// GET - LISTAR INSTRUTORES
// ================================
export const listarInstrutores = async (req, res) => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.query(
            'SELECT id, nome, email FROM instrutores ORDER BY nome'
        );
        conn.release();

        res.json({ sucesso: true, dados: rows });

    } catch (error) {
        conn.release();
        res.status(500).json({ erro: 'Erro ao buscar instrutores' });
    }
};

// ================================
// POST - CRIAR TREINAMENTO
// ================================
export const criarTreinamento = async (req, res) => {
    const conn = await getConnection();
    try {
        const dados = req.body;

        const sql = `
            INSERT INTO treinamentos 
            (titulo, categoria, descricao, nivel, duracao_horas, capacidade, 
            instrutor_id, modalidade, local_plataforma, 
            data_inicio, data_fim, pre_requisitos, status, sobre, objetivos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            dados.titulo, dados.categoria, dados.descricao, dados.nivel,
            Number(dados.duracao) || 0,
            Number(dados.capacidade) || 0,
            Number(dados.instrutorId) || null,
            dados.modalidade, dados.local,
            tratarData(dados.dataInicio), tratarData(dados.dataFim),
            dados.preRequisitos, dados.status, dados.sobre, dados.objetivos
        ];

        const [result] = await conn.query(sql, values);
        const novoId = result.insertId;

        // salvar competências
        if (dados.competenciasTexto) {
            const tags = dados.competenciasTexto.split(',').map(t => t.trim());

            for (const tag of tags) {
                if (!tag) continue;

                let [rows] = await conn.query(
                    'SELECT id FROM competencias WHERE nome = ?',
                    [tag]
                );

                let tagId;
                if (rows.length > 0) {
                    tagId = rows[0].id;
                } else {
                    const [resTag] = await conn.query(
                        'INSERT INTO competencias (nome) VALUES (?)',
                        [tag]
                    );
                    tagId = resTag.insertId;
                }

                await conn.query(
                    'INSERT INTO treinamento_competencia VALUES (?, ?)',
                    [novoId, tagId]
                );
            }
        }

        // HISTÓRICO
        await registrarHistorico(
            "Treinamento criado",
            `O treinamento "${dados.titulo}" (ID ${novoId}) foi criado.`,
            req.usuarioId || "Sistema"
        );

        conn.release();
        res.status(201).json({
            sucesso: true,
            mensagem: 'Treinamento criado!',
            id: novoId
        });

    } catch (error) {
        conn.release();
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar treinamento' });
    }
};

// ================================
// DELETE - EXCLUIR TREINAMENTO
// ================================
export const excluirTreinamento = async (req, res) => {
    const conn = await getConnection();
    try {
        const { id } = req.params;

        await conn.query('DELETE FROM treinamentos WHERE id = ?', [id]);

        // HISTÓRICO
        await registrarHistorico(
            "Treinamento excluído",
            `O treinamento ID ${id} foi excluído.`,
            req.usuarioId || "Sistema"
        );

        conn.release();
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Treinamento excluído com sucesso'
        });

    } catch (error) {
        conn.release();
        console.error('Erro ao excluir:', error);
        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao excluir treinamento'
        });
    }
};

// ================================
// PUT - ATUALIZAR TREINAMENTO
// ================================
export const atualizarTreinamento = async (req, res) => {
    const conn = await getConnection();
    try {
        const { id } = req.params;
        const dados = req.body;

        const sql = `
            UPDATE treinamentos SET
            titulo=?, categoria=?, descricao=?, nivel=?, 
            duracao_horas=?, capacidade=?, instrutor_id=?, modalidade=?, 
            local_plataforma=?, data_inicio=?, data_fim=?, pre_requisitos=?, status=?, 
            sobre=?, objetivos=?
            WHERE id=?
        `;

        const values = [
            dados.titulo, dados.categoria, dados.descricao, dados.nivel,
            dados.duracao, dados.capacidade, dados.instrutorId,
            dados.modalidade, dados.local,
            tratarData(dados.dataInicio),
            tratarData(dados.dataFim),
            dados.preRequisitos, dados.status, dados.sobre, dados.objetivos,
            id
        ];

        await conn.query(sql, values);

        // atualizar tags
        if (typeof dados.competenciasTexto !== 'undefined') {
            await conn.query(
                'DELETE FROM treinamento_competencia WHERE treinamento_id = ?',
                [id]
            );

            if (dados.competenciasTexto.trim() !== '') {
                const tags = dados.competenciasTexto.split(',').map(t => t.trim());

                for (const tag of tags) {
                    if (!tag) continue;

                    let [rows] = await conn.query(
                        'SELECT id FROM competencias WHERE nome = ?',
                        [tag]
                    );

                    let tagId;

                    if (rows.length > 0) {
                        tagId = rows[0].id;
                    } else {
                        const [resTag] = await conn.query(
                            'INSERT INTO competencias (nome) VALUES (?)',
                            [tag]
                        );
                        tagId = resTag.insertId;
                    }

                    await conn.query(
                        'INSERT INTO treinamento_competencia VALUES (?, ?)',
                        [id, tagId]
                    );
                }
            }
        }

        // HISTÓRICO
        await registrarHistorico(
            "Treinamento atualizado",
            `O treinamento ID ${id} foi atualizado.`,
            req.usuarioId || "Sistema"
        );

        conn.release();
        res.json({ sucesso: true, mensagem: 'Treinamento atualizado!' });

    } catch (error) {
        conn.release();
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar' });
    }
};

// ================================
// GET - BUSCAR POR ID
// ================================
export const buscarTreinamentoPorId = async (req, res) => {
    const conn = await getConnection();
    try {
        const { id } = req.params;

        const sql = `
            SELECT 
                t.*, 
                i.nome AS instrutor_nome, 
                i.email AS instrutor_email,
                i.cargo AS instrutor_cargo,
                i.bio AS instrutor_bio,
                i.experiencia AS instrutor_experiencia,
                GROUP_CONCAT(c.nome) as competencias_lista
            FROM treinamentos t
            LEFT JOIN instrutores i ON t.instrutor_id = i.id
            LEFT JOIN treinamento_competencia tc ON t.id = tc.treinamento_id
            LEFT JOIN competencias c ON tc.competencia_id = c.id
            WHERE t.id = ?
            GROUP BY t.id
        `;

        const [rows] = await conn.query(sql, [id]);
        conn.release();

        if (rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Treinamento não encontrado'
            });
        }

        const treino = rows[0];
        treino.competencias = treino.competencias_lista
            ? treino.competencias_lista.split(',')
            : [];


        res.json({ sucesso: true, dados: treino });

    } catch (error) {
        conn.release();
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar treinamento' });
    }
};

// ================================
// DASHBOARD - CONTAR ATIVOS
// ================================
export const contarTreinamentosAtivos = async (req, res) => {
    const conn = await getConnection();
    try {
        const sql =
            "SELECT COUNT(*) AS total FROM treinamentos WHERE status = 'ativo'";
        const [rows] = await conn.query(sql);
        conn.release();

        res.json({
            sucesso: true,
            totalAtivos: rows[0].total
        });

    } catch (error) {
        conn.release();
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
};
