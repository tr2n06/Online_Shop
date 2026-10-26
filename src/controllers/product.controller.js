import {  productService } from "../services/product.service.js";
export const productController = {
    getAllProducts: async (req, res, next) => {
        try {
            const products = await productService.findAll();
            res.status(200).json(products);
        }
        catch(err) {
            next(err);
        }
    },

    getProductById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const product = await productService.findById(id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.status(200).json(product);
        }
        catch(err) {
            next(err);
        }
    },

    getProductByState: async (req, res, next) => {
        try {
            const state = req.params.state;
            const products = await productService.findByState(state);
            res.status(200).json(products);
        }
        catch(err) {
            next(err);
        }
    },

    createProduct: async (req, res, next) => {
        try {
            const newP = req.body;
            const product = await productService.create(newP);
            res.status(201).json(product);
        }
        catch(err) {
            next(err);
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            const newProductData = req.body;
            const product = await productService.update(id, newProductData);
            res.status(200).json(product);
        }
        catch(err) {
            next(err);
        }
    },

    updateQuantity: async (req, res, next) => {
        try { 
            const q= req.params.quantity * -1;
            const id = req.params.id;
            const product = await productService.updateQuantity(id, q);
            res.status(200).json(product);
        }
        catch(err) {
            next(err);
        }
    },

    deleteProduct: async (req, res, next) => {
        try { 
            const id = req.params.id;
            const products = await productService.delete(id);
            res.status(200).json(products);
        }
        catch(err) {
            next(err);
        }
    }
}