import db from "../config/db.config.js";
import { productRepo } from "../repositories/product.repo.js";
import { orderRepo } from "../repositories/order.repo.js";
import { userRepo } from "../repositories/user.repo.js";
import { ErrorResponse } from "../utils/error.helper.js";

const conn = await db.getConnection();

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
        try {
            await conn.beginTransaction();

            const { items } = data;
            let sum_price = 0;
            for (const i of items) {
                const product = await productRepo.findById(i.product_id);
                if (!product) throw new ErrorResponse(`Product with ID ${i.product_id} not found`, 404);

                if (product.state == "INACTIVE") throw new ErrorResponse(`Product: ${product.name} is inactive`, 422);
                if (product.quantity < i.quantity) throw new ErrorResponse(`Insufficient stock for product ${product.name}`, 422);

                i.price = product.price;
                sum_price += i.quantity * product.price;
            }

            const orderData = { ...data, sum_price };
            const orderId = await orderRepo.create(orderData);
            if (!orderId) throw new ErrorResponse("Failed to create order", 409);
            await orderRepo.createOrderItems(orderId, items);

            await productRepo.updateStock(items, conn);

            await conn.commit();
            const order = await orderService.findById(orderId);
            return order;
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    },

    update: async (id, newO) => {
        let { state, note, address, phone } = newO;
        let result = 0;

        const o = await orderService.findById(id);
        if (!o) throw ErrorResponse("This order is not found", 404); 

        if (!state) result = await orderRepo.updateInfo(id, { note, address, phone });
        else {
            if (state == "CANCELLED") {
                if (o.state != "PENDING" && o.state != "PROCESSING") {
                    throw new ErrorResponse("Only orders in PENDING or PROCESSING state can be cancelled", 422);
                }
            }

            result = await orderRepo.updateState(id, state);
        }

        if (result === 0) throw new ErrorResponse("Order not found", 404);
        return await orderService.findById(id);
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