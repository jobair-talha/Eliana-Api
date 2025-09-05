import { model, Schema } from "mongoose";
import { ISlider } from "./slider.interface";

const sliderSchema = new Schema<ISlider>({
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, required: true, default: '/' },
    order: { type: Number, required: true, default: 1 },
    isActive: { type: Boolean, required: true, default: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    }
});


export const Slider = model<ISlider>('Slider', sliderSchema);