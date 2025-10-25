import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { Customer } from "../customer/customer.model";
import { User } from "../user/user.model";
import { orderSearchableFields } from "./order.constants";
import { IOrder, IOrderFilters } from "./order.interface";
import { Order } from "./order.model";
import { createAutoSerial } from "./order.utills";


const createCustomerOrder = async (
    orderData: Partial<IOrder>
): Promise<IOrder> => {
    console.log(orderData)
    try {
        const serial = await createAutoSerial();

        let userId = orderData.user as any;

        if (!userId) {
            const customerMobile = orderData.customerInfo?.mobile;
            if (!customerMobile) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Customer mobile is required");
            }

            // Create or update Customer
            const customer = await Customer.findOneAndUpdate(
                { mobile: customerMobile },
                {
                    $setOnInsert: {
                        id: `CU-${Date.now()}`,
                        name: orderData.customerInfo?.name,
                        email: orderData.customerInfo?.email,
                        mobile: customerMobile,
                        address: orderData.customerInfo?.address,
                    },
                },
                { new: true, upsert: true }
            ).exec();

            // Create or update User
            const user = await User.findOneAndUpdate(
                { customer: customer._id },
                {
                    $setOnInsert: {
                        id: `U-${Date.now()}`,
                        role: "customer",
                        password: config.default_customer_pass as string,
                        customer: customer._id,
                    },
                },
                { new: true, upsert: true }
            ).exec();

            userId = user._id;
        }

        // Create Order (no session, no transaction)
        const orderDoc = await Order.create({
            ...orderData,
            serial,
            user: userId,
        });

        if (!orderDoc) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
        }

        return orderDoc;
    } catch (err) {
        console.error(err);
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
    }
};


const getAllOrders = async (
    filters: IOrderFilters,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
    // Extract searchTerm to implement search query
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];
    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: orderSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    // Dynamic  Sort needs  field to  do sorting
    const sortConditions: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Order.find(whereConditions)
        .sort(sortConditions)
        .populate({
            path: "products.product",
            select: "thumbnail name sku",
        })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getOrderById = async (id: string): Promise<IOrder | null> => {
    const result = await Order.findById(id);
    return result;
};

const updateOrder = async (id: string, orderData: Partial<IOrder>): Promise<IOrder | null> => {
    const result = await Order.findByIdAndUpdate(id, orderData, { new: true });
    return result;
};

const updateOrderStatus = async (id: string, orderStatus: string): Promise<IOrder | null> => {
    const result = await Order.findByIdAndUpdate(
        id,
        { orderStatus },
        { new: true }
    );
    return result;
}
const deleteOrder = async (id: string): Promise<IOrder | null> => {
    const result = await Order.findByIdAndDelete(id);
    return result;
};

export const OrderService = {
    createCustomerOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus
};