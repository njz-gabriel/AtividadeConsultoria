import express from 'express';
import db from '../config/db.js';

const router = express.Router();

/* Colaboradores por departamento */
router.get('/colaboradores-por-departamento', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT departamento, COUNT(*) AS total
            FROM usuarios
            GROUP BY departamento
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro no banco de dados" });
    }
});

/* Colaboradores por unidade */
router.get('/colaboradores-por-unidade', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT unidade, COUNT(*) AS total
            FROM usuarios
            GROUP BY unidade
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro no banco de dados" });
    }
});

/* Inscrições por treinamento */
router.get('/inscricoes-por-treinamento', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.titulo, COUNT(i.id) AS total
            FROM treinamentos t
            LEFT JOIN inscricoes i ON t.id = i.treinamento_id
            GROUP BY t.id, t.titulo
            ORDER BY total DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro no banco de dados" });
    }
});

/* Treinamentos por categoria */
router.get('/treinamentos-por-categoria', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT categoria, COUNT(*) AS total
            FROM treinamentos
            GROUP BY categoria
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro no BD" });
    }
});

/* Colaboradores por status de inscrição */
router.get('/status-inscricoes', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS total
            FROM inscricoes
            GROUP BY status
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erro no BD" });
    }
});

export default router;
