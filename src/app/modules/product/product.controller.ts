import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { productFilterableFields } from "./product.contant";
import { IProduct } from "./product.interfaces";
import { ProductService } from "./product.service";
import { createSlug } from "./product.utills";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const { ...productData } = req.body;
    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files['thumbnail'] && files['thumbnail'][0]) {
            productData.thumbnail = files['thumbnail'][0].filename;
        }
        if (files['galleryImages']) {
            productData.galleryImages = files['galleryImages'].map(file => file.filename);
        }
    }
    productData.slug = createSlug(productData.name);
    productData.regularPrice = parseFloat(productData.regularPrice);
    if (productData.salePrice) {
        productData.salePrice = parseFloat(productData.salePrice);
    }
    productData.categories = JSON.parse(productData.categories as unknown as string);
    productData.discount = JSON.parse(productData.discount as unknown as string);
    const result = await ProductService.createProduct(productData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product created successfully!",
        data: result,
    });

});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { ...productData } = req.body;
    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files['thumbnail'] && files['thumbnail'][0]) {
            productData.thumbnail = files['thumbnail'][0].filename;
        }
        if (files['galleryImages']) {
            productData.galleryImages = files['galleryImages'].map(file => file.filename);
        }
    }
    productData.slug = createSlug(productData.name);
    productData.categories = JSON.parse(productData.categories as unknown as string);
    productData.discount = JSON.parse(productData.discount as unknown as string);
    const result = await ProductService.updateProduct(productData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product updated successfully!",
        data: result,
    });
});

const getSingleProductBySlug = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await ProductService.getSingleProductBySlug(slug);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product retrieved successfully!",
        data: result,
    });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, productFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await ProductService.getAllProducts(
        filters,
        paginationOptions
    );



    sendResponse<IProduct[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getHomeProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.getHomeProducts();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Home products retrieved successfully!",
        data: result,
    });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    await ProductService.deleteProduct(slug);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product deleted successfully!",
    });
});

export const ProductController = {
    createProduct,
    updateProduct,
    getSingleProductBySlug,
    deleteProduct,
    getAllProducts,
    getHomeProducts
};
