import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function getConnection() {
    return pool.getConnection();
}

export async function read(table, where = null) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) sql += ` WHERE ${where}`;
        const [rows] = await connection.execute(sql);
        return rows;
    } finally {
        connection.release();
    }
}

export async function create(table, data) {
    const connection = await getConnection();
    try {
        const columns = Object.keys(data).join(', ');
        const placeholders = Array(Object.keys(data).length).fill('?').join(', ');
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const values = Object.values(data);
        const [result] = await connection.execute(sql, values);
        return result.insertId;
    } finally {
        connection.release();
    }
}

export async function update(table, data, where) {
    const connection = await getConnection();
    try {
        const set = Object.keys(data).map(column => `${column} = ?`).join(', ');
        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
        const values = Object.values(data);
        const [result] = await connection.execute(sql, values);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

export async function deleteRecord(table, where) {
    const connection = await getConnection();
    try {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const [result] = await connection.execute(sql);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

export async function comparePassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Erro ao comparar senha:', error);
        return false;
    }
}

export async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Erro ao gerar hash da senha:', error);
        throw error;
    }
}

export default pool;