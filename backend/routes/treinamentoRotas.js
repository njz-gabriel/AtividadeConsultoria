import express from 'express';
import {
  listarTreinamentos,
  criarTreinamento,
  excluirTreinamento,
  atualizarTreinamento,
  buscarTreinamentoPorId,
  listarInstrutores,
  contarTreinamentosAtivos
} from '../controllers/TreinamentoController.js';

const router = express.Router();


router.get('/ativos/count', contarTreinamentosAtivos);

// OUTRAS ROTAS
router.get('/', listarTreinamentos);
router.get('/instrutores', listarInstrutores);
router.post('/', criarTreinamento);
router.delete('/:id', excluirTreinamento);
router.put('/:id', atualizarTreinamento);
router.get('/:id', buscarTreinamentoPorId);

export default router;
