import UsuarioModel from "../models/UsuarioModel.js";

class UsuarioController {

    // Criar usuário
    static async criarUsuario(req, res) {
        try {
            const {
                nome,
                email,
                senha,
                cargo,
                departamento,
                unidade,
                nivelAcesso
            } = req.body;

            const dados = {
                nome,
                email,
                senha,
                cargo,
                departamento,
                unidade,
                nivel_acesso: nivelAcesso || "Colaborador"
            };

            delete dados.nivelAcesso;

            const novoUsuario = await UsuarioModel.criar(dados);

            return res.status(201).json({
                mensagem: 'Usuário cadastrado com sucesso!',
                usuario: novoUsuario
            });

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ erro: 'Erro ao criar usuário' });
        }
    }



    // Listar com paginação
    static async listarUsuarios(req, res) {
        try {
            const { pagina = 1, limite = 10 } = req.query;

            const resultado = await UsuarioModel.listarTodos(
                Number(pagina),
                Number(limite)
            );

            return res.status(200).json({
                usuarios: resultado.usuarios,
                total: resultado.total,
                pagina: resultado.pagina,
                limite: resultado.limite,
                totalPaginas: resultado.totalPaginas
            });

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({ erro: 'Erro ao listar usuários' });
        }
    }



    // Buscar por ID
    static async buscarPorId(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.params.id);

            if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

            return res.status(200).json(usuario);

        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
    }



    static async atualizarPerfil(req, res) {
        const { id } = req.params;
        const {
            nome,
            email,
            telefone,
            cargo,
            departamento,
            unidade,
            sobre,
            senha,
        } = req.body;

        try {
            // Busca usuário no DB
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

            // Se houver senha, criptografa
            let senhaCriptografada = usuario.senha;
            if (senha && senha.trim() !== "") {
                const salt = await bcrypt.genSalt(10);
                senhaCriptografada = await bcrypt.hash(senha, salt);
            }

            // Atualiza campos
            await usuario.update({
                nome: nome || usuario.nome,
                email: email || usuario.email,
                telefone: telefone || usuario.telefone,
                cargo: cargo || usuario.cargo,
                departamento: departamento || usuario.departamento,
                unidade: unidade || usuario.unidade,
                sobre: sobre || usuario.sobre,
                senha: senhaCriptografada,
            });

            return res.status(200).json({ message: "Perfil atualizado com sucesso", usuario });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar perfil" });
        }
    }


    // Atualizar (admin)
    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const {
                nome,
                email,
                senha,
                cargo,
                departamento,
                unidade,
                nivelAcesso
            } = req.body;

            // Monta os dados corretamente com os nomes DO BANCO
            const dadosAtualizados = {
                nome,
                email,
                cargo,
                departamento,
                unidade,
                nivel_acesso: nivelAcesso
            };

            // Se senha vier vazia, remove do update
            if (!senha || senha.trim() === "") {
                delete dadosAtualizados.senha;
            } else {
                dadosAtualizados.senha = senha;
            }

            const resultado = await UsuarioModel.atualizar(id, dadosAtualizados);

            if (!resultado) {
                return res.status(400).json({ erro: "Usuário não encontrado ou não atualizado" });
            }

            return res.status(200).json({
                mensagem: "Usuário atualizado com sucesso!",
                usuario: resultado
            });

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            return res.status(500).json({
                erro: error.message || "Erro interno ao atualizar usuário"
            });
        }
    }



    // Excluir
    static async excluirUsuario(req, res) {
        try {
            await UsuarioModel.excluir(req.params.id);
            return res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return res.status(500).json({ erro: 'Erro ao excluir usuário' });
        }
    }
}

export default UsuarioController;
