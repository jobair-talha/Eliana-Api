import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { createAutoSerial } from "./order.utills";

const createCustomerOrder = async (orderData: Partial<IOrder>): Promise<IOrder> => {
    orderData.serial = await createAutoSerial();
    if (!orderData.user) {
        const user = await User.create({
            name: orderData.customerInfo?.name,
            password: "defaultpassword",
            role: "customer",
        })
        orderData.user = user._id;
    }
    const result = await Order.create(orderData);
    return result;
};

const getOrderById = async (id: string): Promise<IOrder | null> => {
    const result = await Order.findById(id);
    return result;
};

const updateOrder = async (id: string, orderData: Partial<IOrder>): Promise<IOrder | null> => {
    const result = await Order.findByIdAndUpdate(id, orderData, { new: true });
    return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
    const result = await Order.findByIdAndDelete(id);
    return result;
};

export const OrderService = {
    createCustomerOrder,
    getOrderById,
    updateOrder,
    deleteOrder
};