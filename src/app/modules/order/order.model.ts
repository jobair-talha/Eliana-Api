import { model, Schema } from "mongoose";
import { IOrder, OrderModel } from "./order.interface";

const orderSchema = new Schema<IOrder, OrderModel>({
    serial: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 },
        returns: { type: Number, required: true, default: 0 }
    }],
    totalAmount: { type: Number, required: true, default: 0 },
    shippingAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    totalProductsPrice: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    payAmount: { type: Number, required: true, default: 0 },
    remainingPayableAmount: { type: Number, required: true, default: 0 },
    deliveryStatus: { type: String, enum: ['pending', 'shipped', 'delivered', 'returned'], default: 'pending' },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled', 'hold', "shipped", "delivered", "courier_delivered", "returned", "persial_delivered", "refunded", "courier_cancelled"],
        default: 'pending'
    },
    customerInfo: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String },
    },
    shippingInfo: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String },
    },

}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});

export const Order = model<IOrder, OrderModel>('Order', orderSchema);
