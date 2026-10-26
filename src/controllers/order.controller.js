import { orderService } from "../services/order.service.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const orderController = {
    getAllOrders: async (req, res, next) => {
        try {
            const os = await orderService.findAll();
            res.status(200).json(os);
        }
        catch(err) {
            next(err);
        }
    },
    getOrderById: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id || id == " ") throw ErrorResponse("Invalid id, id= ", id, 400); 
            const o = await orderService.findById(id);
            res.status(200).json(o);
        }
        catch(err) {
            next(err);
        }
    },
    getOrdersByState: async (req, res, next) => {
        try {
            const state = req.params.state;
            if (!state || state == " ") throw ErrorResponse("Invalid state, state= ", state, 400); 
            const os = await orderService.findByState(state);
            res.status(200).json(os);
        }
        catch(err) {
            next(err);
        }
    },
    getOrdesrByUserId: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            if (!userId || userId == " ") throw ErrorResponse("Invalid userId, userId= ", userId, 400); 
            const os = await orderService.findByUserId(userId);
            res.status(200).json(os);
        }
        catch(err) {
            next(err);
        }
    },
    updateOrderInformation: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id || id == " ") throw ErrorResponse("Invalid id, id= ", id, 400); 
            const data = req.body;
            const order = await orderService.update(id, data);
            res.status(200).json(order);

        }
        catch(err) {
            next(err);
        }
    },
    createOrder: async (req, res, next) => {
        try {
            const data = req.body;
            const o = await orderService.create(data);
            return res.status(201).json(o);
        }
        catch(err) {
            next(err);
        }
    },
    deleteOrder: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id || id == " ") throw ErrorResponse("Invalid id, id= ", id, 400); 
            const os = await orderService.delete(id);
            return res.status(200).json(os);
        }
        catch(err) {
            next(err);
        }
    }

}