import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { categoriesFilterableFields } from "./category.constants";
import { ICategory } from "./category.interface";
import { CategoryService } from "./category.service";
import { nestedCategories } from "./category.utills";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const { ...categoryData } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files?.image?.[0]) {
        categoryData.image = files.image[0].filename;
    }
    if (files?.adsBanner?.[0]) {
        categoryData.adsBanner = files.adsBanner[0].filename;
    }
    const result = await CategoryService.createCategory(categoryData);

    sendResponse<ICategory>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category created successfully!",
        data: result,
    });
});
const getCategories = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, categoriesFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await CategoryService.getAllCategories(
        filters,
        paginationOptions
    );
    const categoryList = nestedCategories(result.data);

    sendResponse<ICategory[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category list get successfully!",
        data: categoryList,
        meta: result.meta,
    });
});
const getCategory = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await CategoryService.getCategoryBySlug(slug);
    sendResponse<ICategory>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category get successfully!",
        data: result,
    });
});
const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { ...categoryData } = req.body;
    if (req.file) {
        categoryData.image = req.file.filename;
    }
    const result = await CategoryService.updateCategory(slug, categoryData);

    sendResponse<ICategory>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category updated successfully!",
        data: result,
    });
});
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    sendResponse<ICategory>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category deleted successfully!",
    });
});

export const CategoryController = {
    createCategory,
    getCategories,
    deleteCategory,
    updateCategory,
    getCategory,
};
