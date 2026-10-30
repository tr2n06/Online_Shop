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
                throw new ErrorResponse("Invalid or expired access token", 401);
            }

            const newAccess = await authService.refresh(payload, refreshToken);
            payload = jwt.verify(newAccess, process.env.ACCESS_TOKEN_SECRET);

            res.setHeader("x-new-access-token", newAccess);
        }

        const isActive = await authService.isActive(payload.userId);
        if (!isActive) throw new ErrorResponse("Invalid or expired access token", 401);

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
            const user_id = req.params.userId ?? req.params.id;

            if (!u) {
                throw new ErrorResponse("User not existed", 404);
            }

            const needToEquivalent = await authService.isAccepted(
                u.roleId,
                permission_id
            );

            if (needToEquivalent && user_id != u.userId) {
                throw new ErrorResponse("You don't have permission to access this function", 403);
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

