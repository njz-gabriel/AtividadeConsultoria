import { getConnection } from "../config/database.js";

export async function registrarHistorico(acao, descricao, usuarioId = null) {
    const conn = await getConnection();
    try {
        if (!usuarioId || isNaN(Number(usuarioId))) {
            usuarioId = null;
        }

        const sql = `INSERT INTO historico (acao, descricao, usuario_id, datahora)
        VALUES (?, ?, ?, NOW())`;

        const [result] = await conn.query(sql, [acao, descricao, usuarioId]);
        console.log("[historico] inserido id:", result.insertId);

        return { ok: true };
    } catch (err) {
        console.error("[historico] ERRO:", err);
    } finally {
        conn.release();
    }
}

// ⬇⬇⬇ ESTE AQUI PRECISA EXISTIR ⬇⬇⬇
export async function listarHistorico() {
    const conn = await getConnection();
    try {
        const sql = `
            SELECT h.id, h.acao, h.descricao, h.datahora, u.nome AS usuario
            FROM historico h
            LEFT JOIN usuarios u ON u.id = h.usuario_id
            ORDER BY h.datahora DESC
        `;

        const [rows] = await conn.query(sql);
        return rows;
    } catch (err) {
        console.error("[historico] erro listar:", err);
        throw err;
    } finally {
        conn.release();
    }
}
