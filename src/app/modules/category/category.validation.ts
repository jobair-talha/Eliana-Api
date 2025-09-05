const { z } = require("zod");

const createCategory = z.object({
    body: z.object({
        name: z.string({
            required_error: "Name is required!",
        }),
        slug: z.string({
            required_error: "Slug is required!",
        }),
        parentId: z.string().optional(),
        isFeatured: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
    }),
});

const updateCategory = z.object({
    body: z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
        parentId: z.string().optional(),
        isFeatured: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
    }),
});

const deleteCategory = z.object({
    params: z.object({
        id: z.string({
            required_error: "Category ID is required!",
        }),
    }),
});

export const CategoryValidation = {
    createCategory,
    updateCategory,
    deleteCategory,
};
