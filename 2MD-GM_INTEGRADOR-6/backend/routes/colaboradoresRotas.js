import express from "express";
import {
    listarColaboradores,
    criarColaborador,
    atualizarColaborador,
    excluirColaborador,
    contarColaboradores
} from "../controllers/ColaboradorController.js";

const router = express.Router();

// ROTA DE CONTAGEM
router.get("/count", contarColaboradores);

// CRUD COMPLETO
router.get("/", listarColaboradores);
router.post("/", criarColaborador);
router.put("/:id", atualizarColaborador);
router.delete("/:id", excluirColaborador);

export default router;
