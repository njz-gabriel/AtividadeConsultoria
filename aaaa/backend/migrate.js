import fs from "fs";
import path from "path";
import pool from "./config/database.js";

const migrationsDir = path.resolve("migrations");

async function runMigrations() {
    try {
        const files = fs
            .readdirSync(migrationsDir)
            .filter(f => f.endsWith(".sql"))
            .sort();

        console.log("📦 Migrations encontradas:", files);

        const conn = await pool.getConnection();

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf8");

            console.log(`▶ Executando: ${file}`);

            try {
                await conn.query(sql);
                console.log(`✔ Finalizado: ${file}`);
            } catch (err) {
                console.error(`❌ Erro em ${file}:`, err.message);
            }
        }

        conn.release();
        console.log("🎉 TODAS AS MIGRATIONS FORAM EXECUTADAS!");
        process.exit(0);

    } catch (err) {
        console.error("ERRO GERAL:", err);
        process.exit(1);
    }
}

runMigrations();
