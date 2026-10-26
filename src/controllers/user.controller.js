import { userService } from "../services/user.service.js";
export const userController = {
    getAllUsers: async (req, res, next) => {
        try {
            const us = await userService.findAll();
            res.status(200).json(us);
        }
        catch(err) {
            next(err);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const u = await userService.findById(id);
            res.status(200).json(u);
        }   
        catch(err) {
            next(err);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const newU = req.body;
            const u = await userService.create(newU);
            res.status(201).json(u);
        }
        catch(err) {
            next(err);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const newU = req.body;
            const u = await userService.update(req.params.id, newU);
            res.status(200).json(u);
        }
        catch(err) {
            next(err);
        }
    },

    updatePassword: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;
            const u = await userService.updatePassword(id, newPassword);
            res.status(200).json(u);
        }
        catch(err) { 
            next(err);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const u = await userService.delete(req.params.id);
            res.status(200).json(u);
        }
        catch(err) {
            next(err);
        }
    },

    getUserRole: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const role = await userService.findRole(userId);
            res.status(200).json(role);
        }
        catch(err) {
            next(err);
        }
    }
}

