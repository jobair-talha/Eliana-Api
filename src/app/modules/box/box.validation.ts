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
        purchasePrice: z.string().optional(),
        sellingPrice: z.string().optional(),
    }),
});

const updateBoxZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        color: z.string().optional(),
        stock: z.number().optional(),
        purchasePrice: z.string().optional(),
        sellingPrice: z.string().optional(),
    }),
});

export const BoxValidation = {
    createNewBoxZodSchema,
    updateBoxZodSchema,
};