import express from 'express';
import CriptografiaController from '../controllers/CriptografiaController.js';

const router = express.Router();

// GET /criptografia/info
router.get('/info', CriptografiaController.obterInfoCriptografia);

// POST /criptografia/cadastrar-usuario
router.post('/cadastrar-usuario', CriptografiaController.cadastrarUsuario);

// Rotas OPTIONS para CORS
router.options('/info', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

router.options('/cadastrar-usuario', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

export default router;

