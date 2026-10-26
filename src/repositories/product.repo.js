import { ErrorResponse } from "../utils/error.helper.js";
import db from "../config/db.config.js";

export const productRepo = {
    findAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM products"
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );
        return rows[0] || null;
    },

    findByName: async (name) => {
        const [rows] = await db.execute(
            "SELECT * FROM products WHERE name LIKE ?",
            [`%${name}%`]
        );
        return rows;
    },

    findByState: async (state) => {
        const [rows] = await db.execute(
            "SELECT * FROM products WHERE state = ?",
            [state]
        );
        return rows;
    },

    create: async ({ name, description, price, quantity, state, category_id }) => {
        const [result] = await db.execute(
            `INSERT INTO products (name, description, price, quantity, state, category_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description ?? null, price, quantity ?? 0, state ?? "ACTIVE", category_id]
        );
        return result.insertId;
    },

    update: async (id, newP) => {
        let { name, description, price, quantity, state } = newP;
        const oldP = await productRepo.findById(id);
        if (!oldP) throw new ErrorResponse("Product not found", 404);

        name = name ?? oldP.name;
        description = description ?? oldP.description;
        price = price ?? oldP.price;
        quantity = quantity ?? oldP.quantity;
        state = state ?? oldP.state;

        const [result] = await db.execute(
            `UPDATE products
         SET name = ?, description = ?, price = ?, quantity = ?, state = ?
         WHERE id = ?`,
            [name, description ?? null, price, quantity, state, id]
        );
        return result.affectedRows;
    },

    updateStock: async(items, conn = db) => {
        for (const i of items) {
            const { product_id, quantity } = i;
            const [result] = await conn.execute(
                "UPDATE products SET quantity = quantity - ? WHERE id = ?",
                [quantity, product_id]
            );
            if (result.affectedRows === 0) {
                throw new ErrorResponse(`Product with ID ${product_id} not found`, 404);
            }
        }
    },

    delete: async (id) => {
        const [result] = await db.execute(
            "DELETE FROM products WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }
}
