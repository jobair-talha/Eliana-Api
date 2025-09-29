import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BoxController } from './box.controller';
import { BoxValidation } from './box.validation';
const router = express.Router();

router.post(
    '/',
    validateRequest(BoxValidation.createNewBoxZodSchema),
    // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BoxController.createBox
);
router.get(
    '/:id',
    // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
    BoxController.getSingleBox
);

router.get(
    '/',
    // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
    BoxController.getAllBoxes
);

router.patch(
    '/:id',
    validateRequest(BoxValidation.updateBoxZodSchema),
    // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BoxController.updateBox
);
router.delete(
    '/:id',
    // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BoxController.deleteBox
);
export const BoxRoutes = router;