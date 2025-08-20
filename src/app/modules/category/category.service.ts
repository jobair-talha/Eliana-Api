import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { deleteFile } from "../../../helpers/fileDelete";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { categoriesSearchableFields } from "./category.constants";
import { ICategory, ICategoryFilters, NestedCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategory = async (payload: ICategory): Promise<ICategory> => {
    const exitCategory = await Category.findOne({
        slug: payload.slug,
    });
    if (exitCategory) {
        throw new ApiError(httpStatus.CONFLICT, "Category already exist!");
    }
    const result = await Category.create(payload);
    return result;
};

const updateCategory = async (id: string, payload: ICategory): Promise<ICategory | null> => {
    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    if (payload.image && category.image) {
        await deleteFile(`public/images/category/${category.image}`);
    }
    const result = await Category.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};

const getAllCategories = async (filters: ICategoryFilters, paginationOptions: IPaginationOptions): Promise<IGenericResponse<NestedCategory[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            $or: categoriesSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
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



    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Category.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await Category.countDocuments();
    return {
        data: result,
        meta: {
            page,
            limit,
            total
        },
    };
};

const getCategoryBySlug = async (slug: string): Promise<ICategory | null> => {
    const result = await Category.findOne({ slug });
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found!");
    }
    return result;
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    if (category.image) {
        await deleteFile(`public/images/category/${category.image}`);
    }
    const result = await Category.findByIdAndDelete(id);
    return result;
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    deleteCategory,
    updateCategory,
    getCategoryBySlug,
};
