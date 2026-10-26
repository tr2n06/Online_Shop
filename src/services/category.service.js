import { categoryRepo } from "../repositories/category.repo.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const categoryService = {
    findAll: async () => {
        return await categoryRepo.findAll();
    }, 

    findById: async (id) => {
        const c = await categoryRepo.findById(id);
        if (!c) throw new ErrorResponse("Category not found", 404);
        return c;
    },

    create: async (c) => {
        const id = await categoryRepo.create(c);
        const newC = await categoryRepo.findById(id);
        if (!newC) throw new ErrorResponse("Failed to create new category", 409);
        return newC;
    },

    update: async (id, newC) => {
        const result = await categoryRepo.update(id, newC);
        if (result === 0) throw new ErrorResponse("category not found", 404);
        return await categoryRepo.findById(id);
    },

    delete: async (id) => {
        const result = await categoryRepo.delete(id);
        if (result === 0) throw new ErrorResponse("Cannot delete this category", 409);
        return await categoryRepo.findAll();
    }
}
