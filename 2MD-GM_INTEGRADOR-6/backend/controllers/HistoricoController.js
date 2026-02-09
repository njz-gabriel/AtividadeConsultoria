// backend/controllers/HistoricoController.js
import { listarHistorico } from "../utils/historico.js";

export async function listarHistoricoController(req, res) {
    try {
        const rows = await listarHistorico();

        return res.json({
            sucesso: true,
            dados: rows   // <-- AGORA O FRONT RECEBE "dados"
        });

    } catch (err) {
        console.error("Erro listarHistoricoController:", err);
        return res.status(500).json({
            sucesso: false,
            erro: "Erro ao buscar histórico"
        });
    }
}
