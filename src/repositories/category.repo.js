import { ErrorResponse } from "../utils/error.helper.js";
import db from "../config/db.config.js";

export const categoryRepo = {
    findAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM categories"
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );
        return rows[0] || null;
    },

    create: async ({ name, description }) => {
        const [result] = await db.execute(
            `INSERT INTO categories (name, description)
         VALUES (?, ?)`,
            [name, description ?? null]
        );
        return result.insertId;
    },

    update: async (id, newCategoryData) => {
        let { name, description } = newCategoryData;
        const oldCategory = await categoryRepo.findById(id);
        if (!oldCategory) throw new ErrorResponse("Category not found", 404);

        name = name ?? oldCategory.name;
        description = description ?? oldCategory.description;

        const [result] = await db.execute(
            `UPDATE categories
         SET name = ?, description = ?
         WHERE id = ?`,
            [name, description ?? null, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.execute(
            "DELETE FROM categories WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }
}
