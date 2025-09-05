
const { z } = require("zod");

const createCustomerOrder = z.object({
    body: z.object({
        products: z.array(z.object({
            product: z.string({ required_error: "Product ID is required!" }),
            quantity: z.number({ required_error: "Quantity is required!" }).min(1, { message: "Quantity must be at least 1!" }),
        })),
        shippingInfo: z.object({
            name: z.string({ required_error: "Shipping name is required!" }),
            address: z.string({ required_error: "Shipping address is required!" }),
            mobile: z.string({ required_error: "Shipping mobile is required!" }),
            email: z.string().email().optional(),
        }),
        customerInfo: z.object({
            name: z.string({ required_error: "Customer name is required!" }),
            address: z.string({ required_error: "Customer address is required!" }),
            mobile: z.string({ required_error: "Customer mobile is required!" }),
            email: z.string().email().optional(),
        }),
        totalAmount: z.number({ required_error: "Total amount is required!" }).min(0, { message: "Total amount must be at least 0!" }),
        shippingAmount: z.number({ required_error: "Shipping amount is required!" }).min(0, { message: "Shipping amount must be at least 0!" }),
        paymentMethod: z.string({ required_error: "Payment method is required!" }),
        paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
        orderStatus: z.enum(["pending", "processing", "completed", "cancelled", "hold", "shipped", "delivered", "courier_delivered", "returned", "persial_delivered", "refunded", "courier_cancelled"]).optional(),
    }),
});

export const OrderValidation = {
    createCustomerOrder,
};