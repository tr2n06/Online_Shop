import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string({
        error: "Name is required"
    }).min(2, "Name must be at least 2 characters"),

    description: z.string().optional()
}); 

export const updateCategorySchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .optional(),

    description: z.string().optional()
}).refine(
    data => data.name !== undefined || data.description !== undefined,
    {
        message: "At least one field must be provided to update",
        path: ["body"]
    }
);