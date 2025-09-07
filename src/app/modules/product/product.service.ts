import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { RedisClient } from "../../../shared/redis";
import { productSearchableFields } from "./product.contant";
import { IProduct, IProductFilters } from "./product.interfaces";
import { Product } from "./product.model";

const createProduct = async (productData: IProduct) => {
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
        throw new ApiError(httpStatus.CONFLICT, "This slug already exists!");
    }
    const product = await Product.findOne({ sku: productData.sku });
    if (product) {
        throw new ApiError(httpStatus.CONFLICT, "This SKU already exists!");
    }
    const newProduct = await Product.create(productData);
    return newProduct;
};

const updateProduct = async (productData: IProduct) => {
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (!existingProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(existingProduct._id, productData, { new: true, runValidators: true, upsert: true });
    return updatedProduct;
};

const getSingleProductBySlug = async (slug: string) => {
    const product = await Product.findOne({ slug }).populate({
        path: 'categories',
        select: 'name slug',
    });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    return product;
};

const getAllProducts = async (
    filters: IProductFilters,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    // Extract searchTerm to implement search query
    const { searchTerm, ...filtersData } = filters;

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: productSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // Filters needs $and to fullfill all the conditions
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

    // If there is no condition , put {} to give all data
    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Product.find(whereConditions)
        .populate({
            path: 'categories',
            select: 'name slug -_id',
        })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await Product.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getHomeProducts = async () => {
    const redisKey = `products:home`;
    const cachedProducts = await RedisClient.get(redisKey);
    if (cachedProducts) {
        return JSON.parse(cachedProducts);
    }

    const featuredProducts = await Product.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(8);
    const newProducts = await Product.find({ isNew: true }).sort({ createdAt: -1 }).limit(8);
    const bestSellingProducts = await Product.find({ isBestSelling: true }).sort({ sellsQuantity: -1 }).limit(8);
    await RedisClient.set(redisKey, JSON.stringify({ featuredProducts, newProducts, bestSellingProducts }), { EX: 3600 });
    return { featuredProducts, newProducts, bestSellingProducts };
};

const deleteProduct = async (slug: string) => {
    const product = await Product.findOneAndDelete({ slug });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    return product;
};

export const ProductService = {
    createProduct,
    updateProduct,
    getSingleProductBySlug,
    deleteProduct,
    getAllProducts,
    getHomeProducts,
};