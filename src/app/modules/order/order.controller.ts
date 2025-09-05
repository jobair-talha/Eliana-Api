import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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


export const OrderController = {
    createCustomerOrder,
};