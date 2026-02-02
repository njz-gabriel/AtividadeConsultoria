import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = express.Router();

// Listar usuários
router.get("/", UsuarioController.listarUsuarios);

// Criar usuário
router.post("/", UsuarioController.criarUsuario);

// Atualizar perfil do usuário
router.put("/:id/perfil", UsuarioController.atualizarPerfil);

// Atualizar usuário (rota admin)
router.put("/:id", UsuarioController.atualizarUsuario);

// Excluir usuário
router.delete("/:id", UsuarioController.excluirUsuario);

export default router;
