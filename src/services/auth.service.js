import jwt from "jsonwebtoken"
import brcypt from "bcrypt"
import { authRepo } from "../repositories/auth.repo.js"
import { userRepo } from "../repositories/user.repo.js"
import { ErrorResponse } from "../utils/error.helper.js";

export const authService = {
    createAccessToken(u) {
        return jwt.sign(
            { userId: u.id, roleId: u.role_id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7h" }
        )
    },

    createRefreshToken(u) {
        return jwt.sign({ userId: u.id, roleId: u.role_id }, process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )
    },

    async register(data) {
        const existingU = await userRepo.findByEmail(email)

        if (existingU) {
            throw new ErrorResponse("Email is existed", 409)
        }
        const hashedPassword = await brcypt.hash(password, 10)
        await userRepo.create(data)

        return { message: "Register successfully" }
    },

    async login(email, password) {
        const u = await userRepo.findByEmail(email)
        if (!u) {
            throw ErrorResponse("Cannot find this user", 404)
        }

        const match = await brcypt.compare(password, u.password_hash)
        if (!match) {
            throw ErrorResponse("Invalid password", 401)
        }

        const refresh = this.createRefreshToken(u)
        await authRepo.saveRefreshToken(u.id, refresh)

        return {
            accessToken: this.createAccessToken(u),
            refreshToken: refresh
        }
    },

    async logout(id) {

        await authRepo.deleteRefreshTokenByUserId(id)
    },

    async deleteRefreshToken(token) {
        await authRepo.deleteRefreshToken(token)
    },

    async refresh(pl, refreshToken) {
        const active = await authRepo.isExistingToken(refreshToken);
        if (!active) {
            throw new UnauthorizedError("Invalid or expired access token");
        }

        const u = await authRepo.findById(pl.userId)
        if (!u) {
            throw new UnauthorizedError("User not found");
        }
        return await this.createAccessToken(u)
    },

    async isAccepted(role_id, permission_id) {
        const r_p = await authRepo.findAccept(role_id, permission_id);
        if (!r_p) throw new ErrorResponse("You don't have enough permission to access this", 403);
        return r_p.needToEquivalent;
    }

}