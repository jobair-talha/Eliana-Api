import express from 'express';
import { FileUpload } from "../../../helpers/fileUpload";
import validateRequest from '../../middlewares/validateRequest';
import { allowedMimeTypes } from './slider.constant';
import { SliderController } from './slider.controller';
import { SliderValidations } from './slider.validations';

const router = express.Router();

const imageUpload = FileUpload("public/images/sliders/", allowedMimeTypes);

router.post(
    "/",
    // auth(
    //     ENUM_USER_ROLE.SUPER_ADMIN,
    //     ENUM_USER_ROLE.ADMIN,
    // ),
    imageUpload.single("image"),
    validateRequest(SliderValidations.createSlider),
    SliderController.createSlider
);

router.put(
    "/:id",
    // auth(
    //     ENUM_USER_ROLE.SUPER_ADMIN,
    //     ENUM_USER_ROLE.ADMIN,
    // ),
    imageUpload.single("image"),
    validateRequest(SliderValidations.updateSlider),
    SliderController.updateSlider
);

router.get(
    "/:id",
    // auth(
    //     ENUM_USER_ROLE.SUPER_ADMIN,
    //     ENUM_USER_ROLE.ADMIN,
    // ),
    validateRequest(SliderValidations.getSlider),
    SliderController.getSlider
);

router.get(
    "/",
    SliderController.getSliders
);

router.delete(
    "/:id",
    // auth(
    //     ENUM_USER_ROLE.SUPER_ADMIN,
    //     ENUM_USER_ROLE.ADMIN,
    // ),
    validateRequest(SliderValidations.deleteSlider),
    SliderController.deleteSlider
);

export const SliderRoutes = router;