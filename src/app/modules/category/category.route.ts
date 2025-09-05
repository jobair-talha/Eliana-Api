import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { FileUpload } from "../../../helpers/fileUpload";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { allowedMimeTypes } from "./category.constants";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

const imageUpload = FileUpload("public/images/category/", allowedMimeTypes);

router.get("/", CategoryController.getCategories);
router.get("/:slug", CategoryController.getCategory);
router.post(
    "/",
    /* auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
    ), */
    imageUpload.fields([{ name: "image", maxCount: 1 }, { name: "adsBanner", maxCount: 1 }]),
    validateRequest(CategoryValidation.createCategory),
    CategoryController.createCategory
);
router.put(
    "/:slug",
    /* auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
    ), */
    validateRequest(CategoryValidation.updateCategory),
    imageUpload.fields([{ name: "image", maxCount: 1 }, { name: "adsBanner", maxCount: 1 }]),
    CategoryController.updateCategory
);
router.delete(
    "/:id",
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
    ),
    validateRequest(CategoryValidation.deleteCategory),
    CategoryController.deleteCategory
);

export const CategoryRoutes = router;
