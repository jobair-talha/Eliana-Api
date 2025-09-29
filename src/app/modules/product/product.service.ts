import httpStatus from "http-status";
import { PipelineStage, SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
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
    }).populate({
        path: 'boxs.box',
        select: 'name color',
    });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    return product;
};

const getSingleHomeProducts = async (slug: string) => {
    const product = await Product.findOne({ slug }).populate({
        path: 'categories',
        select: 'name slug',
    }).populate({
        path: 'boxs.box',
        select: 'name color',
    });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    const relatedProducts = await Product.find({
        categories: { $in: product.categories },
        _id: { $ne: product._id }
    }).sort({ createdAt: -1 }).limit(8).populate({
        path: 'categories',
        select: 'name slug',
    });
    return { product, relatedProducts };
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
        }).populate({
            path: 'boxs.box',
            select: 'name color',
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
    const featuredProducts = await Product.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(8);
    const newProducts = await Product.find({ isNewProduct: true }).sort({ createdAt: -1 }).limit(8);
    const bestSellingProducts = await Product.find({}).sort({ sellsQuantity: -1 }).limit(8);
    return { featuredProducts, newProducts, bestSellingProducts };
};
const getCategoryProducts = async (
    categorySlug: string,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IProduct[]>> => {
    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const order: 1 | -1 = sortOrder === "asc" ? 1 : -1;

    const sortStage: PipelineStage.Sort = {
        $sort: sortBy ? { [sortBy]: order } : { createdAt: -1 }
    };

    const pipelineBase: PipelineStage[] = [
        {
            $lookup: {
                from: "categories", // ✅ must match collection name
                localField: "categories",
                foreignField: "_id",
                as: "categoryDetails",
            },
        },
        {
            $match: {
                "categoryDetails.slug": categorySlug, // ✅ works for arrays
            },
        },
    ];

    const aggregation = await Product.aggregate([
        ...pipelineBase,
        {
            $facet: {
                data: [sortStage, { $skip: skip }, { $limit: limit }],
                total: [{ $count: "count" }],
            },
        },
    ]);

    const data = aggregation[0]?.data || [];
    const total = aggregation[0]?.total?.[0]?.count || 0;

    if (data.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "Products not found");
    }

    return {
        meta: {
            page,
            limit,
            total,
        },
        data,
    };
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
    getSingleHomeProducts,
    getCategoryProducts
};