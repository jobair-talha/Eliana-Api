import { z } from "zod";

// Helpers for FormData (everything initially comes as string or string[])
const toNumber = (min = 0) =>
    z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = Number(val);
        return Number.isNaN(num) ? val : num;
    }, z.number().min(min));

const toBoolean = z.preprocess((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
        const v = val.toLowerCase();
        if (["true", "1", "yes", "on"].includes(v)) return true;
        if (["false", "0", "no", "off"].includes(v)) return false;
    }
    return undefined;
}, z.boolean().optional());

const toStringArray = (fieldName: string) =>
    z.preprocess((val) => {
        if (Array.isArray(val)) return val.map(String).filter(Boolean);
        if (typeof val === "string") {
            if (!val.trim()) return [];
            // Try JSON array
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) return parsed.map(String);
            } catch {
                // Fallback: comma separated
            }
            return val.split(",").map((s) => s.trim()).filter(Boolean);
        }
        return [];
    }, z.array(z.string()).min(1, { message: `At least one ${fieldName} is required!` }));

const discountSchema = z.preprocess((val) => {
    if (typeof val === "string") {
        if (!val.trim()) return undefined;
        try {
            return JSON.parse(val);
        } catch {
            return undefined;
        }
    }
    return val;
}, z.object({
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: toNumber(0),
}).optional());

const createProduct = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required!" }),
        slug: z.string().optional(),
        description: z.string().optional(),
        sortDescription: z.string().optional(),
        sku: z.string().optional(),
        categories: toStringArray("category"),
        galleryImages: toStringArray("gallery image").optional(),
        thumbnail: z.string({ required_error: "Thumbnail is required!" }).optional(),
        regularPrice: toNumber(0),
        salePrice: toNumber(0).optional(),
        flashPrice: toNumber(0).optional(),
        discount: discountSchema,
        stock: toNumber(0).optional(),
        isInStock: toBoolean,
        isFeatured: toBoolean,
        isNewProduct: toBoolean,
        isFlashSale: toBoolean,
        isPublished: toBoolean,
        purchaseQuantity: toNumber(0).optional(),
        totalPurchased: toNumber(0).optional(),
        sellsQuantity: toNumber(0).optional(),
        totalSales: toNumber(0).optional(),
        totalStock: toNumber(0).optional(),
    }),
});

const updateProduct = z.object({
    body: z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        sortDescription: z.string().optional(),
        sku: z.string().optional(),
        categories: toStringArray("category").optional(),
        galleryImages: toStringArray("gallery image").optional(),
        thumbnail: z.string().optional(),
        regularPrice: toNumber(0).optional(),
        salePrice: toNumber(0).optional(),
        flashPrice: toNumber(0).optional(),
        discount: discountSchema,
        stock: toNumber(0).optional(),
        isInStock: toBoolean,
        isFeatured: toBoolean,
        isNewProduct: toBoolean,
        isFlashSale: toBoolean,
        isPublished: toBoolean,
        purchaseQuantity: toNumber(0).optional(),
        totalPurchased: toNumber(0).optional(),
        sellsQuantity: toNumber(0).optional(),
        totalSales: toNumber(0).optional(),
        totalStock: toNumber(0).optional(),
    }),
});

const deleteProduct = z.object({
    params: z.object({
        slug: z.string({ required_error: "Slug is required!" }),
    }),
});

const getSingleProduct = z.object({
    params: z.object({
        slug: z.string({ required_error: "Slug is required!" }),
    }),
});

const getAllProducts = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.string().optional(),
        searchTerm: z.string().optional(),
    }),
});


export const ProductValidation = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
};
