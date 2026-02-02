import {
    create,
    read,
    update,
    deleteRecord,
    comparePassword,
    hashPassword,
    getConnection
} from '../config/database.js';

class UsuarioModel {

    // Listar com paginação
    static async listarTodos(pagina = 1, limite = 10) {
        try {
            const offset = (pagina - 1) * limite;

            const connection = await getConnection();
            try {
                const sql = 'SELECT * FROM usuarios ORDER BY id DESC LIMIT ? OFFSET ?';
                const [usuarios] = await connection.query(sql, [limite, offset]);

                const [totalResult] = await connection.execute('SELECT COUNT(*) AS total FROM usuarios');
                const total = totalResult[0].total;

                return {
                    usuarios,
                    total,
                    pagina,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const rows = await read('usuarios', `id = ${id}`);
        return rows[0] || null;
    }

    // Buscar por Email
    static async buscarPorEmail(email) {
        const rows = await read('usuarios', `email = '${email.toLowerCase()}'`);
        return rows[0] || null;
    }

    // Criar usuário
    static async criar(dadosUsuario) {
    try {
        const senhaHash = await hashPassword(dadosUsuario.senha);

    
        if ("nivel_acesso" in dadosUsuario) {
            delete dadosUsuario.nivel_acesso;
        }

        const dadosComHash = {
            ...dadosUsuario,
            email: dadosUsuario.email.toLowerCase(),
            senha: senhaHash
        };

        return await create('usuarios', dadosComHash);

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}
    // Atualizar usuário
    static async atualizar(id, dadosUsuario) {
        try {
            if (dadosUsuario.senha) {
                dadosUsuario.senha = await hashPassword(dadosUsuario.senha);
            }

            if (dadosUsuario.email) {
                dadosUsuario.email = dadosUsuario.email.toLowerCase();
            }

            return await update('usuarios', dadosUsuario, `id = ${id}`);

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    // Excluir usuário
    static async excluir(id) {
        return await deleteRecord('usuarios', `id = ${id}`);
    }

    // Login
    static async verificarCredenciais(email, senha) {
        try {
            const usuario = await this.buscarPorEmail(email.toLowerCase());

            if (!usuario) return null;

            const senhaValida = await comparePassword(senha, usuario.senha);

            if (!senhaValida) return null;

            const { senha: _, ...usuarioSemSenha } = usuario;

            return usuarioSemSenha;

        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }
}

export default UsuarioModel;
