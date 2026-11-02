import { z } from "zod";

export const createUserSchema = z.object({
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

export const updateUserSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .optional(),

    email: z.email({
        error: "Invalid email format"
    }).optional()
}).refine(
    data => data.name !== undefined || data.email !== undefined,
    {
        message: "At least one field (name or email) must be provided to update",
        path: ["body"]
    }
);

export const updatePasswordSchema = z.object({
    newPassword: z.string({
        error: "New password is required"
    }).min(6, "Password must be at least 6 characters")
});