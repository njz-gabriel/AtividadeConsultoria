const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/inscricoes-mensais", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(data_inicio, '%b') AS mes,
                COUNT(*) AS inscricoes,
                SUM(inscritos_atuais) AS conclusoes
            FROM treinamentos
            GROUP BY MONTH(data_inicio)
            ORDER BY MONTH(data_inicio)
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/categorias-treinamentos", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT categoria AS name,
            COUNT(*) AS value
            FROM treinamentos
            GROUP BY categoria
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/dashboard/colaboradores-por-departamento", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT departamento, COUNT(*) AS total
            FROM usuarios
            GROUP BY departamento;
        `);

        res.json(rows);
    } catch (err) {
        console.error("Erro ao buscar dados:", err);
        res.status(500).json({ error: "Erro ao consultar dados" });
    }
});



module.exports = router;
