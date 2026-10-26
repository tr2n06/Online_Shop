import { categoryService } from "../services/category.service.js";
export const categoryController = {
    getAllCategories: async (req, res, next) => {
        try {
            const cs = await categoryService.findAll();
            res.status(200).json(cs);
        }
        catch(err) {
            next(err);
        }
    },

    getCategoryById: async (req, res, next) => {
        try {
            const c = await categoryService.findById(req.params.id);
            res.status(200).json(c);
        }
        catch(err) {
            next(err);
        }
    },

    createCategory: async (req, res, next) => {
        try {
            const newC = req.body;
            const c = await categoryService.create(newC);
            res.status(201).json(c);
        }
        catch(err) {
            next(err);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const newC = req.body;
            const c = await categoryService.update(req.params.id, newC);
            res.status(200).json(c);
        }
        catch(err) {
            next(err);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const cs = await categoryService.delete(req.params.id);
            res.status(200).json(cs);
        }
        catch(err) {
            next(err);
        }
    }
}