import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { sliderSearchableFields } from "./slider.constant";
import { ISlider, ISliderFilters } from "./slider.interface";
import { Slider } from "./slider.model";

const createSlider = async (payload: ISlider): Promise<ISlider> => {
    const result = await Slider.create(payload);
    return result;
};

const updateSlider = async (id: string, payload: Partial<ISlider>): Promise<ISlider | null> => {
    const result = await Slider.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const singleSlider = async (id: string): Promise<ISlider | null> => {
    const result = await Slider.findById(id);
    return result;
};
const getAllSlider = async (filters: ISliderFilters, paginationOptions: IPaginationOptions): Promise<IGenericResponse<ISlider[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            $or: sliderSearchableFields.map((field) => ({
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

    const result = await Slider.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await Slider.countDocuments(whereConditions);
    return {
        data: result,
        meta: {
            page,
            limit,
            total
        },
    };
};
const deleteSlider = async (id: string): Promise<ISlider | null> => {
    const result = await Slider.findByIdAndDelete(id);
    return result;
};


export const sliderService = {
    createSlider,
    updateSlider,
    singleSlider,
    getAllSlider,
    deleteSlider
};