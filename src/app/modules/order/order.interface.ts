import { Model, Types } from "mongoose";

export interface IOrderProduct {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    returns: number;
}

export interface ICustomerInfo {
    name: string;
    address: string;
    mobile: string;
    email?: string;
}

export interface IShippingInfo {
    name: string;
    address: string;
    mobile: string;
    email?: string;
    city: string;
}

export interface IOrder {
    serial: string;
    user: Types.ObjectId;
    products: IOrderProduct[];
    totalAmount: number;
    shippingAmount: number;
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    payAmount: number;
    remainingPayableAmount: number;
    discountAmount: number;
    totalProductsPrice: number;
    deliveryStatus: "pending" | "shipped" | "delivered" | "returned";
    orderStatus:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled"
    | "hold"
    | "shipped"
    | "delivered"
    | "courier_delivered"
    | "returned"
    | "persial_delivered"
    | "refunded"
    | "courier_cancelled";
    customerInfo: ICustomerInfo;
    shippingInfo: IShippingInfo;
}

export type OrderModel = Model<IOrder, Record<string, unknown>>;

export type IOrderFilters = {
    searchTerm?: string;
    user?: Types.ObjectId;
    status?: IOrder['orderStatus'];
    paymentStatus?: IOrder['paymentStatus'];
    createdAt?: Date;
    updatedAt?: Date;
};