import { z } from "zod";

export const createOrderSchema = z.object({
    user_id: z.number({
        error: "User id is required"
    }).int("User id must be an integer")
      .positive("User id must be greater than 0"),

    items: z.array(
        z.object({
            product_id: z.number({
                error: "Product id is required"
            }).int("Product id must be an integer")
              .positive("Product id must be greater than 0"),

            quantity: z.number({
                error: "Quantity is required"
            }).int("Quantity must be an integer")
              .positive("Quantity must be greater than 0")
        })
    ).min(1, "Order must contain at least one product")
});

export const updateOrderSchema = z.object({
    state: z.enum(
        ["PENDING", "SHIPPING", "DELIVERED", "CANCELLED"],
        {
            error: "Invalid order state"
        }
    ).optional()
}).refine(
    data => data.state !== undefined,
    {
        message: "At least one field must be provided to update",
        path: ["body"]
    }
);