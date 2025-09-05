import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { sliderFilterableFields } from "./slider.constant";
import { ISlider } from "./slider.interface";
import { sliderService } from "./slider.service";
import { generateOrderId } from "./slider.utills";

const createSlider = catchAsync(async (req: Request, res: Response) => {
    const { ...sliderData } = req.body;
    if (req.file) {
        sliderData.imageUrl = req.file.filename;
    }
    const order = await generateOrderId();
    sliderData.order = order;

    const result = await sliderService.createSlider(
        sliderData
    );

    sendResponse<ISlider>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slider created successfully!',
        data: result,
    });
});

const updateSlider = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...sliderData } = req.body;

    if (req.file) {
        sliderData.imageUrl = req.file.filename;
    }
    const result = await sliderService.updateSlider(id, sliderData);

    sendResponse<ISlider>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slider updated successfully!',
        data: result,
    });
});

const getSliders = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, sliderFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await sliderService.getAllSlider(filters, paginationOptions);

    sendResponse<ISlider[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sliders retrieved successfully!',
        data: result.data,
        meta: result.meta,
    });
});

const getSlider = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await sliderService.singleSlider(id);

    sendResponse<ISlider>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slider retrieved successfully!',
        data: result,
    });
});

const deleteSlider = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await sliderService.deleteSlider(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slider deleted successfully!',
    });
});

export const SliderController = {
    createSlider,
    updateSlider,
    getSliders,
    getSlider,
    deleteSlider,
};
