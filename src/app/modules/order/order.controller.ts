import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { orderFilterableFields } from "./order.constants";
import { IOrder } from "./order.interface";
import { OrderService } from "./order.service";

const createCustomerOrder = catchAsync(async (req: Request, res: Response) => {
    const { ...orderData } = req.body;
    const result = await OrderService.createCustomerOrder(orderData);

    sendResponse<IOrder>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order created successfully!",
        data: result,
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, orderFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await OrderService.getAllOrders(
        filters,
        paginationOptions
    );

    sendResponse<IOrder[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    const result = await OrderService.updateOrderStatus(orderId, orderStatus);

    sendResponse<IOrder>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order status updated successfully!',
        data: result,
    });
});

export const OrderController = {
    createCustomerOrder,
    getAllOrders,
    updateOrderStatus,
};