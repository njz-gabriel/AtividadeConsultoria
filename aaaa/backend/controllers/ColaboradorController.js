import { getConnection } from "../config/database.js";
import { registrarHistorico } from "../utils/historico.js";

// LISTAR COLABORADORES
export async function listarColaboradores(req, res) {
    try {
        const conn = await getConnection();
        const [rows] = await conn.query(`
            SELECT * FROM usuarios 
            WHERE nivel_acesso = 'Colaborador'
            ORDER BY created_at DESC
        `);
        conn.release();

        return res.json({ sucesso: true, dados: rows });

    } catch (erro) {
        console.error("Erro ao listar colaboradores:", erro);
        return res.status(500).json({ erro: "Erro ao listar colaboradores" });
    }
}

// CRIAR COLABORADOR
export async function criarColaborador(req, res) {
    try {
        const { nome, email, senha, cargo, departamento, unidade } = req.body;

        const conn = await getConnection();
        const sql = `
            INSERT INTO usuarios 
            (nome, email, senha, cargo, departamento, unidade, nivel_acesso) 
            VALUES (?, ?, ?, ?, ?, ?, 'Colaborador')
        `;
        const values = [nome, email, senha, cargo, departamento, unidade];

        const [result] = await conn.query(sql, values);
        conn.release();

        // Registrar no histórico
        await registrarHistorico(
            "Colaborador criado",
            `Colaborador ${nome} foi criado.`,
            req.usuarioId || "Sistema"
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: "Colaborador criado com sucesso!",
            id: result.insertId
        });

    } catch (erro) {
        console.error("Erro ao criar colaborador:", erro);
        return res.status(500).json({ erro: "Erro ao criar colaborador" });
    }
}

// ATUALIZAR COLABORADOR
export async function atualizarColaborador(req, res) {
    try {
        const { id } = req.params;
        const dados = req.body;

        const conn = await getConnection();

        // Buscar nome antigo
        const [old] = await conn.query(`SELECT nome FROM usuarios WHERE id=? AND nivel_acesso='Colaborador'`, [id]);
        const nomeAntigo = old[0]?.nome || "Colaborador";

        const sql = `
            UPDATE usuarios SET 
            nome=?, email=?, cargo=?, departamento=?, unidade=?
            WHERE id=? AND nivel_acesso='Colaborador'
        `;
        const values = [dados.nome, dados.email, dados.cargo, dados.departamento, dados.unidade, id];

        await conn.query(sql, values);
        conn.release();

        // Registrar no histórico
        await registrarHistorico(
            "Colaborador atualizado",
            `Colaborador ${nomeAntigo} foi atualizado para ${dados.nome}.`,
            req.usuarioId || "Sistema"
        );

        return res.json({ sucesso: true, mensagem: "Colaborador atualizado!" });

    } catch (erro) {
        console.error("Erro ao atualizar colaborador:", erro);
        return res.status(500).json({ erro: "Erro ao atualizar colaborador" });
    }
}

// EXCLUIR COLABORADOR
export async function excluirColaborador(req, res) {
    try {
        const { id } = req.params;

        const conn = await getConnection();

        // Buscar nome antes de deletar
        const [rows] = await conn.query(`SELECT nome FROM usuarios WHERE id=? AND nivel_acesso='Colaborador'`, [id]);
        const nome = rows[0]?.nome || "Colaborador";

        await conn.query(`DELETE FROM usuarios WHERE id=? AND nivel_acesso='Colaborador'`, [id]);
        conn.release();

        // Registrar no histórico
        await registrarHistorico(
            "Colaborador excluído",
            `Colaborador ${nome} foi excluído.`,
            req.usuarioId || "Sistema"
        );

        return res.json({ sucesso: true, mensagem: "Colaborador excluído com sucesso!" });

    } catch (erro) {
        console.error("Erro ao excluir colaborador:", erro);
        return res.status(500).json({ erro: "Erro ao excluir colaborador" });
    }
}

// CONTAR COLABORADORES
export async function contarColaboradores(req, res) {
    try {
        const conn = await getConnection();
        const [rows] = await conn.query(`
            SELECT COUNT(*) AS total 
            FROM usuarios
            WHERE nivel_acesso = 'Colaborador'
        `);
        conn.release();

        return res.json({ total: rows[0].total });

    } catch (erro) {
        console.error("Erro ao contar colaboradores:", erro);
        return res.status(500).json({ erro: "Erro ao contar colaboradores" });
    }
}
