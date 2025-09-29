import { z } from 'zod';

const createNewBoxZodSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Name is required',
        }),
        color: z.string({
            required_error: 'Color is required',
        }),
        stock: z.number().optional(),
        purchasePrice: z.number().optional(),
        sellingPrice: z.number().optional(),
    }),
});

const updateBoxZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        color: z.string().optional(),
        stock: z.number().optional(),
        purchasePrice: z.number().optional(),
        sellingPrice: z.number().optional(),
    }).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" }),
});

export const BoxValidation = {
    createNewBoxZodSchema,
    updateBoxZodSchema,
};