import db from "../config/db.config.js";
import { productRepo } from "../repositories/product.repo.js";
import { orderRepo } from "../repositories/order.repo.js";
import { userRepo } from "../repositories/user.repo.js";
import { ErrorResponse } from "../utils/error.helper.js";


export const orderService = {
    findAll: async () => {
        return await orderRepo.findAll();
    },

    findById: async (id) => {
        let o = await orderRepo.findById(id);
        if (!o) throw new ErrorResponse("Order not found", 404);
        let items = await orderRepo.findItems(id);
        o.items = items;
        return o;
    },

    findByState: async (state) => {
        return await orderRepo.findByState(state);
    },

    findByUserId: async (userId) => {
        return await orderRepo.findByUserId(userId);
    },


    create: async (data) => {
        const conn = await db.getConnection();
        let committed = false;
        let transactionStarted = false;

        try {
            await conn.beginTransaction();
            transactionStarted = true;

            const { items } = data;

            if (!Array.isArray(items) || items.length === 0) {
                throw new ErrorResponse("Order must contain items", 400);
            }

            // Gộp số lượng nếu sản phẩm bị lặp ID
            const quantities = new Map();

            for (const item of items) {
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                    throw new ErrorResponse("Invalid product quantity", 400);
                }

                quantities.set(
                    item.product_id,
                    (quantities.get(item.product_id) || 0) + item.quantity
                );
            }

            const sortedIds = [...quantities.keys()].sort((a, b) => a - b);
            const orderItems = [];
            let sum_price = 0;

            for (const productId of sortedIds) {
                // Khóa dòng sản phẩm trong transaction
                const [rows] = await conn.execute(
                    "SELECT * FROM products WHERE id = ? FOR UPDATE",
                    [productId]
                );

                const product = rows[0];
                const quantity = quantities.get(productId);

                if (!product) {
                    throw new ErrorResponse(
                        `Product with ID ${productId} not found`,
                        404
                    );
                }

                if (product.state !== "ACTIVE") {
                    throw new ErrorResponse(
                        `Product ${product.name} is inactive`,
                        422
                    );
                }

                if (product.quantity < quantity) {
                    throw new ErrorResponse(
                        `Insufficient stock for ${product.name}`,
                        422
                    );
                }

                orderItems.push({
                    product_id: productId,
                    quantity,
                    price: product.price
                });

                sum_price += Number(product.price) * quantity;
            }

            const orderId = await orderRepo.create(
                { ...data, sum_price },
                conn
            );

            if (!orderId) {
                throw new ErrorResponse("Failed to create order", 409);
            }

            await orderRepo.createOrderItems(
                orderId,
                orderItems,
                conn
            );

            await productRepo.updateStock(orderItems, conn);

            await conn.commit();
            committed = true;

            return await orderService.findById(orderId);

        } catch (err) {
            if (transactionStarted && !committed) {
                await conn.rollback();
            }
            throw err;
        } finally {
            conn.release();
        }
    },


    update: async (id, newO) => {
        const conn = await db.getConnection();
        let committed = false;
        let transactionStarted = false;

        try {
            await conn.beginTransaction();
            transactionStarted = true;

            const { state, note, address, phone } = newO;

            const [rows] = await conn.execute(
                "SELECT * FROM orders WHERE id = ?",
                [id]
            );

            const order = rows[0];

            if (!order) {
                throw new ErrorResponse("Order not found", 404);
            }

            if (order.state === "CANCELLED" &&
                state !== undefined &&
                state !== "CANCELLED") {
                throw new ErrorResponse(
                    "Cancelled orders cannot change state",
                    422
                );
            }

            if (state === "CANCELLED" &&
                order.state !== "CANCELLED") {

                if (!["PENDING", "PROCESSING"].includes(order.state)) {
                    throw new ErrorResponse(
                        "Only PENDING or PROCESSING orders can be cancelled",
                        422
                    );
                }

                const [items] = await conn.execute(
                    `SELECT product_id, quantity
                 FROM order_items
                 WHERE order_id = ?`,
                    [id]
                );

                // Hoàn số lượng sản phẩm vào kho
                for (const item of items) {
                    const [result] = await conn.execute(
                        `UPDATE products
                     SET quantity = quantity + ?
                     WHERE id = ?`,
                        [item.quantity, item.product_id]
                    );

                    if (result.affectedRows === 0) {
                        throw new ErrorResponse(
                            `Product ${item.product_id} not found`,
                            404
                        );
                    }
                }
            }

            const [result] = await conn.execute(
                `UPDATE orders
             SET state = ?, note = ?, address = ?, phone = ?
             WHERE id = ?`,
                [
                    state ?? order.state,
                    note ?? order.note,
                    address ?? order.address,
                    phone ?? order.phone,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                throw new ErrorResponse("Failed to update order", 409);
            }

            await conn.commit();
            committed = true;

            return await orderService.findById(id);

        } catch (err) {
            if (transactionStarted && !committed) {
                await conn.rollback();
            }
            throw err;
        } finally {
            conn.release();
        }
    },

    delete: async (id) => {
        const order = await orderRepo.findById(id);
        if (!order) throw new ErrorResponse("Order not found", 404);

        if (order.state !== "CANCELLED" && order.state !== "COMPLETED") {
            throw new ErrorResponse("Only orders in CANCELLED or COMPLETED state can be deleted", 422);
        }

        const result = await orderRepo.delete(id);
        if (result === 0) throw new ErrorResponse("Failed to delete order", 409);
        return await orderRepo.findAll();
    }
}