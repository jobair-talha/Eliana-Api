import { IProduct, ProductModel } from "./product.interfaces";

import { Schema, model } from "mongoose";

const productSchema = new Schema<IProduct, ProductModel>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    sku: { type: String, required: true, unique: true, index: true },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    shortDescription: { type: String, default: '' },
    galleryImages: [{ type: String, required: true }],
    thumbnail: { type: String, required: true },
    regularPrice: { type: Number, required: true, default: 0 },
    salePrice: { type: Number, required: true, default: 0 },
    flashPrice: { type: Number, required: true, default: 0 },
    discount: {
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        discountValue: {
            type: Number,
            default: 0
        }
    },
    stock: { type: Number, required: true, default: 0 },
    stockAlrt: { type: Number, required: true, default: 0 },
    isInStock: { type: Boolean, required: true, default: true },
    isFeatured: { type: Boolean, required: true, default: false },
    isNewProduct: { type: Boolean, required: true, default: false },
    isFlashSale: { type: Boolean, required: true, default: false },
    isBestSelling: { type: Boolean, required: true, default: false },
    isPublished: { type: Boolean, required: true, default: true },
    purchaseQuantity: { type: Number, required: true, default: 0 },
    totalPurchased: { type: Number, required: true, default: 0 },
    sellsQuantity: { type: Number, required: true, default: 0 },
    totalSales: { type: Number, required: true, default: 0 },
    totalStock: { type: Number, required: true, default: 0 },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },

}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
productSchema.pre('save', function (next) {
    if (this.discount && this.discount.discountValue > 0) {
        if (this.discount.discountType === 'percentage') {
            this.salePrice = this.regularPrice - (this.regularPrice * this.discount.discountValue / 100);
        } else if (this.discount.discountType === 'fixed') {
            this.salePrice = this.regularPrice - this.discount.discountValue;
        }
        if (this.salePrice < 0) {
            this.salePrice = 0;
        }
    }
    next();
});

export const Product = model<IProduct, ProductModel>("Product", productSchema);