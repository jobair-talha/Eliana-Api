import { Model } from "mongoose";

export type ISlider = {
    imageUrl: string;
    linkUrl: string;
    order: number;
    isActive: boolean;
};

export type SliderModel = Model<ISlider, Record<string, unknown>>;
export type ISliderFilters = {
    searchTerm?: string;
    isActive?: boolean;
    order?: number;
};
