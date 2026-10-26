import db from "../config/db.config.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const orderRepo = {
    findAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM orders ORDER BY created_time DESC"
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            "SELECT * FROM orders WHERE id = ?",
            [id]
        );
        return rows[0] || null;
    },

    findByUserId: async (userId) => {
        const [rows] = await db.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_time DESC",
            [userId]
        );
        return rows;
    },

    findByState: async (state) => {
        const [rows] = await db.execute(
            "SELECT * FROM orders WHERE state = ?",
            [state]
        );
        return rows;
    },

    findItems: async (orderId) => {
        const [rows] = await db.execute(
            `SELECT oi.*, p.name AS product_name
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId]
        );
        return rows;
    },

    isBoughtProduct: async (product_id) => {
        const [rows] = await db.execute(
            `SELECT *
             FROM order_items 
             WHERE product_id = ?`,
            [product_id]
        );
        return rows.length > 0;
    },
 
    create: async (data, conn = db) => {
        const { user_id, sum_price, note, address, phone } = data;
        const [result] = await conn.execute(
            `INSERT INTO orders (user_id, sum_price, note, address, phone)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, sum_price, note ?? null, address, phone]
        );
        return result.insertId;
    },

    addItem: async (data, conn = db) => {
        const { order_id, product_id, quantity, price } = data;
        const [result] = await conn.execute(
            `INSERT INTO order_items (order_id, product_id, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [order_id, product_id, quantity, price]
        );
        return result.affectedRows;
    },

    updateState: async (id, state) => {
        const order = await orderRepo.findById(id);
        state = state?? order.state;

        const [result] = await db.execute(
            "UPDATE orders SET state = ? WHERE id = ?",
            [state, id]
        );

        return result.affectedRows;
    },

    updateInfo: async (id, { note, address, phone }) => {
        const order = await orderRepo.findById(id);

        note = note?? order.note;
        address = address?? order.address;
        phone = phone?? order.phone;

        const [result] = await db.execute(
            `UPDATE orders SET note = ?, address = ?, phone = ?
             WHERE id = ?`,
            [note, address, phone, id]
        );
        return result.affectedRows;
    },

    createOrderItems: async(orderId, items) => {
        const values = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
        const [result] = await db.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
            [values]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.execute(
            "DELETE FROM orders WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }
};
