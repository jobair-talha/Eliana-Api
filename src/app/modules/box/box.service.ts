import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { boxSearchableFields } from "./box.constant";
import { IBox, IBoxFilters } from "./box.interface";
import { Box } from "./box.model";

const getAllBoxes = async (
    filters: IBoxFilters,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBox[]>> => {
    // Extract searchTerm to implement search query
    const { searchTerm, ...filtersData } = filters;

    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: boxSearchableFields.map(field => ({
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

    // Dynamic sort needs  fields to  do sorting
    const sortConditions: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }

    // If there is no condition , put {} to give all data
    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Box.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await Box.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const createNewBox = async (payload: IBox): Promise<IBox> => {
    const newBox = await Box.create(payload);
    return newBox;
};

const updateBox = async (id: string, payload: IBox): Promise<IBox | null> => {
    console.log(payload)
    const isExit = await Box.findById(id);
    if (!isExit) {
        throw new ApiError(httpStatus.NOT_FOUND, "Box not found");
    }
    const updatedBox = await Box.findByIdAndUpdate(id, payload, { new: true });
    return updatedBox;
};

const getSingleBox = async (id: string): Promise<IBox | null> => {
    const isExit = await Box.findById(id);
    if (!isExit) {
        throw new ApiError(httpStatus.NOT_FOUND, "Box not found");
    }
    return isExit;
};

const deleteBox = async (id: string): Promise<IBox | null> => {
    const isExit = await Box.findById(id);
    if (!isExit) {
        throw new ApiError(httpStatus.NOT_FOUND, "Box not found");
    }
    const deletedBox = await Box.findByIdAndDelete(id);
    return deletedBox;
};

export const BoxService = {
    getAllBoxes,
    createNewBox,
    updateBox,
    deleteBox,
    getSingleBox,
};
