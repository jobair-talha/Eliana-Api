import { Slider } from "./slider.model";

export const generateOrderId = async () => {
    const lastSlider = await Slider.findOne().sort({ order: -1 }).select('order').lean();
    return lastSlider ? lastSlider.order + 1 : 1;
};

