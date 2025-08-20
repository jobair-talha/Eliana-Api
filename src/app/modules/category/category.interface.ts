import { Model, Types } from 'mongoose';
export type ICategory = {
    _id: Types.ObjectId;
    parentId: { type: Types.ObjectId, ref: "category", default: null },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
};

export interface NestedCategory extends ICategory {
    children?: NestedCategory[];
}

export type CategoryModel = Model<ICategory, Record<string, unknown>>;

export type ICategoryFilters = {
    searchTerm?: string;
    name?: string;
    slug?: string;
    parentId?: Types.ObjectId | null;
    isFeatured?: boolean;
};
