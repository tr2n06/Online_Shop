import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({
        error: "Name is required"
    }).min(2, "Name must be at least 2 characters"),

    email: z.email({
        error: "Invalid email format"
    }),

    password: z.string({
        error: "Password is required"
    }).min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
    email: z.email({
        error: "Invalid email format"
    }),

    password: z.string({
        error: "Password is required"
    }).min(6, "Password must be at least 6 characters")
}); 