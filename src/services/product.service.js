import { productRepo } from "../repositories/product.repo.js";
import { orderRepo } from "../repositories/order.repo.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const productService = {
    findAll: async () => {
        return await productRepo.findAll();
    },

    findById: async (id) => {
        const p = await productRepo.findById(id);
        if (!p) throw new ErrorResponse("Product not found", 404);
        return p;
    },

    findByName: async (name) => {
        return await productRepo.findByName(name);
    },

    findByState: async (state) => {
        return await productRepo.findByState(state);
    },

    create: async (p) => {
        const id = await productRepo.create(p);
        const newp = await productRepo.findById(id);
        if (!newp) throw new ErrorResponse("Failed to create new product", 409);
        return newp;
    },

    update: async (id, newP) => {
        const result = await productRepo.update(id, newP);
        if (result === 0) throw new ErrorResponse("Product not found", 404);
        return await productRepo.findById(id);
    },

    updateQuantity: async (id, quantity) => {
        let product = await productRepo.findById(id);
        if (!product) throw new ErrorResponse("Product not found", 404);
        product.quantity -= quantity;
        await productRepo.update(id, product);
        if (result === 0) throw new ErrorResponse("Product not found", 404);
        return await productRepo.findById(id);
    },

    delete: async (id) => {
        const isBought = await orderRepo.isBoughtProduct(id);

        if (isBought) {
            await productRepo.update(id, { state });
        }
        else {
            const result = await productRepo.delete(id);
            if (result === 0) throw new ErrorResponse("Cannot delete this product", 409);
        }

        return await productRepo.findAll();
    }
}
