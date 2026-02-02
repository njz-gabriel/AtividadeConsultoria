import express from "express";
import InscricaoController from "../controllers/InscricaoController.js";

const router = express.Router();

// Rotas CRUD para inscrição
router.get("/", InscricaoController.listar); // Listar todas as inscrições
router.get("/usuario/:id", InscricaoController.listarPorUsuario);
router.post("/", InscricaoController.criar); // Criar inscrição
router.put("/:id/concluir", InscricaoController.concluir); // Concluir inscrição
router.delete("/:id", InscricaoController.excluir); // Excluir inscrição

export default router;
