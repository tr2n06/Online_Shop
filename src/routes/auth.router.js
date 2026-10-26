import express from "express";
import { userController } from "../controllers/user.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", verifyMiddleware, authController.logout)


export const authRouter = router;