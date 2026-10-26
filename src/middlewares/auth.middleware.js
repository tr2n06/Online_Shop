import jwt from "jsonwebtoken";
import { authService } from "../services/auth.service.js";
import { ErrorResponse } from "../utils/error.helper.js";

export const verifyMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new ErrorResponse("Missing or invalid authorization header", 401);
        }

        const accessToken = authorizationHeader.split(" ")[1];

        let payload;

        try {
            payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        }
        catch (error) {
            const reauthorizationHeader = req.headers.reauthorization;
            if (!reauthorizationHeader || !reauthorizationHeader.startsWith("Bearer ")) {
                throw new ErrorResponse("Invalid or expired access token", 401);
            }

            const refreshToken = reauthorizationHeader.split(" ")[1];

            try {
                payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            } catch (err1) {
                await authService.deleteRefreshToken(refreshToken);
                throw new ErrorResponse("Invalid or expired access token", 401);
            }

            const newAccess = await authService.refresh(payload, refreshToken);
            payload = jwt.verify(newAccess, process.env.ACCESS_TOKEN_SECRET);

            res.setHeader("x-new-access-token", newAccess);
        }

        req.user = payload;
        next();
    }
    catch (err) {
        next(err);
    }
}

export const authorizedMiddleware = (permission_id) => {
    return async (req, res, next) => {
        try {
            const u = req.user;
            const user_id = req.params.user_id?? req.params.id;

            if (!u) {
                throw new ErrorResponse("User not existed", 404);
            }

            const needToEquivalent = await authService.isAccepted(
                u.role_id,
                permission_id
            );

            if (needToEquivalent && user_id != u.user_id) {
                const err = new ErrorResponse("Cannot access this function", 403);
                err.statusCode = 403;
                throw err;
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

