import { Model, Types } from "mongoose";
import { ICategory } from "../category/category.interface";

export type IProduct = {
    _id: Types.ObjectId | string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    sku: string;
    categories: Types.ObjectId | ICategory[];
    galleryImages: string[];
    thumbnail: string;
    regularPrice: number;
    salePrice: number;
    flashPrice: number;
    discount: ProductDiscount;
    stock: number;
    stockAlrt: number;
    isInStock: boolean;
    isFeatured: boolean;
    isNewProduct: boolean;
    isFlashSale: boolean;
    isPublished: boolean;
    isBestSelling: boolean;
    purchaseQuantity: number;
    totalPurchased: number;
    sellsQuantity: number;
    totalSales: number;
    totalStock: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export type DiscountType = 'percentage' | 'fixed';

export interface ProductDiscount {
    discountType: DiscountType;
    discountValue: number;
}

export type IProductFilters = {
    searchTerm?: string;
    category?: Types.ObjectId;
    brand?: Types.ObjectId;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};
export type ProductModel = Model<IProduct, Record<string, unknown>>;