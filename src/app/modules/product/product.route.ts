import express from "express";
import { FileUpload } from "../../../helpers/fileUpload";
import validateRequest from "../../middlewares/validateRequest";
import { allowedMimeTypes } from "./product.contant";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validations";

const router = express.Router();

const imageUpload = FileUpload("public/images/products/", allowedMimeTypes);

router.post(
    "/",
    // auth(
    //     ENUM_USER_ROLE.SUPER_ADMIN,
    //     ENUM_USER_ROLE.ADMIN,
    // ),
    imageUpload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]),
    validateRequest(ProductValidation.createProduct),
    ProductController.createProduct
);
router.put(
    "/:slug",
    imageUpload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]),
    validateRequest(ProductValidation.updateProduct),
    ProductController.updateProduct
);

router.get(
    "/home",
    ProductController.getHomeProducts
);

router.get(
    "/frontend/:slug",
    validateRequest(ProductValidation.getSingleProduct),
    ProductController.getSingleHomeProducts
);

router.get(
    "/category/:categorySlug",
    ProductController.getCategoryProducts
);

router.get(
    "/:slug",
    validateRequest(ProductValidation.getSingleProduct),
    ProductController.getSingleProductBySlug
);

router.get(
    "/",
    validateRequest(ProductValidation.getAllProducts),
    ProductController.getAllProducts
);
router.delete(
    "/:slug",
    validateRequest(ProductValidation.deleteProduct),
    ProductController.deleteProduct
);

export const ProductRoutes = router;
