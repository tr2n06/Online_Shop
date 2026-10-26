import { userRepo } from "../repositories/user.repo.js";
import brcypt from "bcrypt";
import { ErrorResponse } from "../utils/error.helper.js";

export const userService = {
    findAll: async () => {
        return await userRepo.findAll();
    },

    findById: async (id) => {
        const u = await userRepo.findById(id);
        if (!u) throw new ErrorResponse("User not found", 404);
        return u;
    },

    findByEmail: async (email) => {
        const u = await userRepo.findByEmail(email);
        if (!u) throw new ErrorResponse("User not found", 404);
        return u;
    },

    create: async ({ name, email, password, phone, role = 2 }) => {
        const existingUser = await userRepo.findByEmail(email);
        if (existingUser) {
            throw new ErrorResponse("Email already exists", 422);
        }

        const hash_password = await brcypt.hash(password, 10)
        const userId = await userRepo.create({ name, email, hash_password, phone });
        const u = await userRepo.findById(userId);
        if (!u) throw new ErrorResponse("Failed to create new user", 409);
        await userRepo.assignRole(userId, role);
        return u;
    },

    update: async (id, { name, phone, password }) => {
        const hash_password = await brcypt.hash(password, 10)
        const updatedRows = await userRepo.update(id, { name, phone, hash_password });
        if (updatedRows === 0) throw new ErrorResponse("User not found", 404);
        const u = await userRepo.findById(id);
        if (!u) throw new ErrorResponse("Failed to update user", 409);
        return u;
    },

    updatePassword: async (id, newPassword) => {
        const hash_password = await brcypt.hash(newPassword, 10)

        const updatedRows = await userRepo.updatePassword(id, hash_password);
        if (updatedRows === 0) throw new ErrorResponse("User not found", 404);
        const u = await userRepo.findById(id);
        if (!u) throw new ErrorResponse("Failed to update password", 409);
        return u;
    },

    delete: async (id) => {
        const deletedRows = await userRepo.delete(id);
        if (deletedRows === 0) throw new ErrorResponse("User not found", 404);
        return await userRepo.findAll();
    },

    findRole: async (userId) => {
        const role = await userRepo.findRole(userId);
        if (!role) throw new ErrorResponse("Role not found", 404);
        return role;
    }

}

