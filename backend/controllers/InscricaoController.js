import InscricaoModel from "../models/InscricaoModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import { registrarHistorico } from "../utils/historico.js";

class InscricaoController {

    // Criar inscrição
    static async criar(req, res) {
        try {
            const { usuario_id, treinamento_id } = req.body;

            // Buscar usuário
            const user = await UsuarioModel.buscarPorId(usuario_id);
            if (!user) return res.status(404).json({ erro: "Usuário não encontrado." });

            if (user.nivel_acesso !== "Colaborador") {
                return res.status(403).json({ erro: "Administradores não podem se inscrever em cursos." });
            }

            // Criar inscrição
            const novaInscricao = await InscricaoModel.criar({ usuario_id, treinamento_id });

            // Buscar título do curso
            const curso = await InscricaoModel.buscarCursoPorId(treinamento_id);

            // Registrar no histórico
            await registrarHistorico(
                "Inscrição criada",
                `O colaborador "${user.nome}" se inscreveu no curso "${curso.titulo}".`,
                req.usuarioId || "Sistema"
            );

            return res.status(201).json({
                mensagem: "Inscrição criada com sucesso!",
                inscricao: novaInscricao
            });

        } catch (error) {
            console.error("Erro ao criar inscrição:", error);
            return res.status(500).json({ erro: "Erro ao criar inscrição" });
        }
    }

    // Concluir inscrição
    static async concluir(req, res) {
        try {
            const { id } = req.params;
            
            // Validação básica
            if (!id || id === 'undefined') {
                return res.status(400).json({ erro: "ID da inscrição inválido." });
            }

            // 1. Busca dados para o histórico (opcional, mas bom pra log)
            const inscricao = await InscricaoModel.buscarPorId(id);
            if (!inscricao) {
                return res.status(404).json({ erro: "Inscrição não encontrada." });
            }

            // 2. Chama o método do Model que criamos no Passo 1
            const atualizou = await InscricaoModel.concluir(id);

            if (!atualizou) {
                return res.status(500).json({ erro: "Não foi possível atualizar o status no banco." });
            }

            // 3. Registra histórico
            await registrarHistorico(
                "Inscrição concluída",
                `O colaborador "${inscricao.usuario}" concluiu o curso "${inscricao.treinamento}".`,
                req.usuarioId || "Sistema"
            );

            // 4. Retorna sucesso
            return res.status(200).json({
                sucesso: true,
                mensagem: "Parabéns! Curso concluído."
            });

        } catch (error) {
            console.error("Erro ao concluir inscrição:", error);
            return res.status(500).json({ erro: "Erro interno ao concluir curso" });
        }
    }

    static async listarPorUsuario(req, res) {
        try {
            const { id } = req.params;
            
            // Chama o método que JÁ EXISTE no seu Model
            const inscricoes = await InscricaoModel.listarPorUsuario(id);
            
            // Retorna no formato que o page.jsx espera ({ sucesso: true, dados: [...] })
            return res.status(200).json({ sucesso: true, dados: inscricoes });
        } catch (error) {
            console.error("Erro ao listar inscrições do usuário:", error);
            return res.status(500).json({ erro: "Erro ao buscar cursos do usuário" });
        }
    }

    // Excluir inscrição
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            // Buscar inscrição antes de excluir
            const inscricao = await InscricaoModel.buscarPorId(id);
            if (!inscricao) return res.status(404).json({ erro: "Inscrição não encontrada." });

            // Excluir inscrição
            await InscricaoModel.excluir(id);

            // Registrar histórico
            await registrarHistorico(
                "Inscrição excluída",
                `A inscrição do colaborador "${inscricao.usuario}" no curso "${inscricao.treinamento}" foi excluída.`,
                req.usuarioId || "Sistema"
            );

            return res.status(200).json({ mensagem: "Inscrição excluída com sucesso!" });

        } catch (error) {
            console.error("Erro ao excluir inscrição:", error);
            return res.status(500).json({ erro: "Erro ao excluir inscrição" });
        }
    }

    // Listar todas as inscrições
    static async listar(req, res) {
        try {
            const inscricoes = await InscricaoModel.listar();
            return res.status(200).json({ sucesso: true, dados: inscricoes });
        } catch (error) {
            console.error("Erro ao listar inscrições:", error);
            return res.status(500).json({ erro: "Erro ao listar inscrições" });
        }
    }

}

export default InscricaoController;
