import { CategoryModel, ICategory } from "./category.interface";

import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema<ICategory, CategoryModel>(
    {
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "category",
            default: null,
        },
        name: {
            type: String,
            trim: true,
            index: true,
            required: true,
        },
        slug: {
            type: String,
            index: true,
            trim: true,
            unique: true,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);
export const Category = mongoose.model<ICategory, CategoryModel>("category", categorySchema);
