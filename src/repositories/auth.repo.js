import pool from "../config/db.config.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const authRepo = {
    async saveRefreshToken(id, token) {
        const [result] = await pool.query(
            "INSERT INTO refresh_tokens(user_id, token) VALUES(?, ?)",
            [id, token]
        )
    },

    async deleteRefreshToken(token) {
        const [result] = await pool.query(
            "DELETE FROM refresh_tokens WHERE token = ?",
            [token]
        )
    },

    async isExistingToken(token) {
        const [rows] = await pool.query(
            "SELECT * FROM refresh_tokens WHERE token = ?",
            [token]
        )

        return rows.length > 0;
    },

    async deleteRefreshTokenByUserId(id) {
        const [result] = await pool.query(
            "DELETE FROM refresh_tokens WHERE user_id = ?",
            [id]
        )
    },

    async findAccept(role_id, permission_id) {
        const [rows] = await pool.execute(
            `SELECT * FROM role_permissions
         WHERE role_id = ? AND permission_id = ?`,
            [role_id, permission_id]
        );

        return rows[0];
    }

} 