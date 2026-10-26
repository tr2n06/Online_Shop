import { ErrorResponse } from "../utils/error.helper.js";
import db from "../config/db.config.js";

export const userRepo = {
    findAll: async () => {
        const [rows] = await db.query(
            `SELECT u.user_id, u.name, u.email, u.phone, ur.role_id
         FROM users u
         LEFT JOIN user_roles ur ON u.user_id = ur.user_id`
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT u.user_id, u.name, u.email, u.phone, ur.role_id
         FROM users u
         LEFT JOIN user_roles ur ON u.user_id = ur.user_id
         WHERE u.user_id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    findByEmail: async (email) => {
        const [rows] = await db.execute(
            `SELECT u.*, ur.role_id
         FROM users u
         LEFT JOIN user_roles ur ON u.user_id = ur.user_id
         WHERE u.email = ?`,
            [email]
        );
        return rows[0] || null;
    },

    create: async ({ name, email, hash_password, phone }) => {
        const [result] = await db.execute(
            "INSERT INTO users (name, email, hash_password, phone) VALUES (?, ?, ?, ?)",
            [name, email, hash_password, phone ?? null]
        );
        return result.insertId;
    },


    update: async (id, { name, phone }) => {
        const oldU = await userRepo.findById(id);
        if (!oldU) {
            const err = new ErrorResponse("User not found", 404);
            err.statusCode = 404;
            throw err;
        }

        name = name ?? oldU.name;
        phone = phone ?? oldU.phone;

        const [result] = await db.execute(
            `UPDATE users
         SET name = ?, phone = ?
         WHERE user_id = ?`,
            [name, phone, id]
        );

        return result.affectedRows;
    },

    updatePassword: async (id, hash_password) => {
        const oldU = await userRepo.findById(id);
        if (!oldU) {
            const err = new ErrorResponse("User not found", 404);
            err.statusCode = 404;
            throw err;
        }
        hash_password = hash_password ?? oldU.hash_password;

        const [result] = await db.execute(
            "UPDATE users SET hash_password = ? WHERE user_id = ?",
            [hash_password, id]
        );

        return result.affectedRows;
    },


    delete: async (id) => {
        const [result] = await db.execute(
            "DELETE FROM users WHERE user_id = ?",
            [id]
        );
        return result.affectedRows;
    },

    findRole: async (userId) => {
        const [row] = await db.execute(
            `SELECT r.role_id, r.name, r.description
             FROM roles r
             JOIN user_roles ur ON r.role_id = ur.role_id
             WHERE ur.user_id = ?`,
            [userId]
        );
        return row[0];
    },

    assignRole: async (userId, roleId) => {
        const [result] = await db.execute(
            "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
            [userId, roleId]
        );
        return result.affectedRows;
    },

    removeRole: async (userId, roleId) => {
        const [result] = await db.execute(
            "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?",
            [userId, roleId]
        );
        return result.affectedRows;
    }
};
