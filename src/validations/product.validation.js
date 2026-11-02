import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string({
        error: "Name is required"
    }).min(2, "Name must be at least 2 characters"),

    description: z.string().optional(),

    price: z.number({
        error: "Price is required"
    }).nonnegative("Price must be greater than or equal to 0"),

    quantity: z.number({
        error: "Quantity is required"
    }).int("Quantity must be an integer")
      .nonnegative("Quantity must be greater than or equal to 0"),

    state: z.enum(["ACTIVE", "INACTIVE"], {
        error: "State must be ACTIVE or INACTIVE"
    }),

    category_id: z.number({
        error: "Category id is required"
    }).int("Category id must be an integer")
      .positive("Category id must be greater than 0")
});

export const updateProductSchema = z.object({ 
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .optional(),

    description: z.string().optional(),

    price: z.number()
        .nonnegative("Price must be greater than or equal to 0")
        .optional(),

    quantity: z.number()
        .int("Quantity must be an integer")
        .nonnegative("Quantity must be greater than or equal to 0")
        .optional(),

    state: z.enum(["ACTIVE", "INACTIVE"], {
        error: "State must be ACTIVE or INACTIVE"
    }).optional(),

    category_id: z.number()
        .int("Category id must be an integer")
        .positive("Category id must be greater than 0")
        .optional()
}).refine(
    data => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided to update",
        path: ["body"]
    }
);

export const updateQuantitySchema = z.object({
    quantity: z.coerce.number({
        error: "Quantity is required"
    }).int("Quantity must be an integer")
});