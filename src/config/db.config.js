import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});

export const connectionDb = async () => {
    try {
        const conn = await pool.getConnection();
        console.log('Database connected successfully');
        conn.release();
    } catch (err) {
        console.error('Database connect failed: ', err.message);
        process.exit(1);
    }
}

export default pool;