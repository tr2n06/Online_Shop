import pool from "../config/db.config.js";

export const authRepo = {
    async saveRefreshToken(id, hash_token, expires_at) {
        await pool.query(
            `INSERT INTO refresh_tokens
            (user_id, token_hash, expires_at, created_at, revoked_at)
            VALUES (?, ?, ?, NOW(), NULL)`,
            [id, hash_token, expires_at]
        );
    },

    async findRefreshTokenByUserId(user_id) {
        const [rows] = await pool.query(
            `SELECT * FROM refresh_tokens
             WHERE user_id = ?
             AND revoked_at IS NULL
             AND expires_at > NOW()
             LIMIT 1`,
            [user_id]
        );

        return rows[0];
    },

    async revokeRefreshTokenByUserId(id) {
        await pool.query(
            `UPDATE refresh_tokens
             SET revoked_at = NOW()
             WHERE user_id = ?
             AND revoked_at IS NULL`,
            [id]
        );
    },

    async findAccept(role_id, permission_id) {
        const [rows] = await pool.execute(
            `SELECT * FROM role_permissions
             WHERE role_id = ? AND permission_id = ?`,
            [role_id, permission_id]
        );

        return rows[0];
    }
};