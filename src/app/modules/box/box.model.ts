import { BoxModel, IBox } from "./box.interface";

import mongoose, { Schema } from "mongoose";

const boxSchema = new Schema<IBox, BoxModel>(
    {
        name: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
            unique: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        purchasePrice: {
            type: Number,
            default: 0,
        },
        sellingPrice: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);
export const Box = mongoose.model<IBox, BoxModel>("Box", boxSchema);

