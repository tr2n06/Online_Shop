import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { authRepo } from "../repositories/auth.repo.js"
import { userService } from "../services/user.service.js"
import { ErrorResponse } from "../utils/error.helper.js";

export const authService = {
    createAccessToken(u) {
        return jwt.sign(
            { userId: u.user_id, roleId: u.role_id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7h" }
        )
    },

    createRefreshToken(u) {
        return jwt.sign({ userId: u.user_id, roleId: u.role_id }, process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )
    },

    async register(data) {
        const existingU = await userService.findByEmail(data.email)

        if (existingU) {
            throw new ErrorResponse("Email is existed", 409)
        }
        data.hash_password = await bcrypt.hash(data.password, 10)
        await userService.create(data)

        return { message: "Register successfully" }
    },

    async login(email, password) {
        let u = await userService.findByEmail(email)
        if (!u) {
            throw ErrorResponse("Cannot find this user", 404)
        }
        const role = await userService.findRole(u.user_id);
        u.role_id = role.role_id;

        const match = await bcrypt.compare(password, u.hash_password)
        if (!match) {
            throw ErrorResponse("Invalid password", 401)
        }

        const token = await authRepo.findRefreshTokenByUserId(u.user_id);
        if (token) {
            throw ErrorResponse("Existed user", 409);
        }

        const refresh = this.createRefreshToken(u);
        const hash_token = await bcrypt.hash(refresh, 10);
        const decoded = jwt.decode(refresh);
        const expiresAt = new Date(decoded.exp * 1000);
        await authRepo.saveRefreshToken(u.user_id, hash_token, expiresAt);

        return {
            accessToken: this.createAccessToken(u),
            refreshToken: refresh
        }
    },

    async logout(id) {

        await authRepo.revokeRefreshTokenByUserId(id);
    },

    async refresh(pl, refreshToken) {
        const token = await authRepo.findRefreshTokenByUserId(pl.userId);

        if (!token) {
            throw new ErrorResponse("Invalid or expired refresh token", 401);
        }

        const active = await bcrypt.compare(
            refreshToken,
            token.token_hash
        );

        if (!active) {
            throw new ErrorResponse("Invalid or expired refresh token", 401);
        }

        const u = await userService.findById(pl.userId);

        if (!u) {
            throw new ErrorResponse("User not found", 404);
        }

        return this.createAccessToken(u);
    },

    async isActive(user_id) {
        const token = await authRepo.findRefreshTokenByUserId(user_id);
        return (token)? true : false;
    },

    async isAccepted(role_id, permission_id) {
        const r_p = await authRepo.findAccept(role_id, permission_id);
        if (!r_p) throw new ErrorResponse("You don't have enough permission to access this", 403);
        return r_p.needToEquivalent;
    },


}



