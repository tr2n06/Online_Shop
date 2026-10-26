import { authService } from "../services/auth.service.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const authController = {
    async register(req, res, next) {
        try {
            const data = req.body;
            const result = await authService.register(data);

            return res.status(201).json({
                message: result.message,
                data: result
            });
        }
        catch(err) {
            next(err);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.login(email, password);

            return res.status(200).json({
                message: "Sign in successfully",
                data: tokens
            });
        }
        catch(err) {
            next(err);
        }
    },

    async logout(req, res, next) {
        try {
            const refreshToken = req.headers.reauthorization?.split(" ")[1];

            if (!refreshToken) {
                throw new ErrorResponse ("Missing refresh token", 401);
            }

            await authService.deleteRefreshToken(refreshToken);

            return res.status(200).json({
                message: "Logout successfully"
            });
        }
        catch(err) {
            next(err);
        }
    }
};