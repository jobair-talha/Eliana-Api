import { Model, Types } from 'mongoose';
export type IBox = {
    _id: Types.ObjectId;
    name: { type: String, required: true },
    color: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
};


export type BoxModel = Model<IBox, Record<string, unknown>>;

export type IBoxFilters = {
    searchTerm?: string;
    name?: string;
    color?: string;
    stock?: string;
    purchasePrice?: string;
    sellingPrice?: string;
};
