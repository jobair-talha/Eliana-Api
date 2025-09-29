import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { boxFilterableFields } from "./box.constant";
import { IBox } from "./box.interface";
import { BoxService } from "./box.service";

const createBox = catchAsync(async (req: Request, res: Response) => {
    const { ...boxData } = req.body;
    const result = await BoxService.createNewBox(boxData);
    sendResponse<IBox>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Box created successfully',
        data: result,
    });
});

const getSingleBox = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BoxService.getSingleBox(id);

    sendResponse<IBox>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Box fetched successfully',
        data: result,
    });
});

const getAllBoxes = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, boxFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await BoxService.getAllBoxes(filters, paginationOptions);
    sendResponse<IBox[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Boxes fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const updateBox = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await BoxService.updateBox(id, updatedData);
    sendResponse<IBox>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Box updated successfully',
        data: result,
    });
});

const deleteBox = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BoxService.deleteBox(id);
    sendResponse<IBox>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Box deleted successfully',
        data: result,
    });
});

export const BoxController = {
    createBox,
    getAllBoxes,
    getSingleBox,
    updateBox,
    deleteBox
};