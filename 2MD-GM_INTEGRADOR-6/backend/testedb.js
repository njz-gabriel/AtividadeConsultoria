import { getConnection } from "./config/database.js";

const testarConexao = async () => {
    try {
        const conn = await getConnection();
        console.log("✅ Conectado com sucesso ao MySQL!");
        conn.release();
        process.exit(0);
    } catch (err) {
        console.error("❌ Erro ao conectar:", err);
        process.exit(1);
    }
};

testarConexao();