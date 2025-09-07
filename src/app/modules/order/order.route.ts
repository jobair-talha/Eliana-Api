import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validations";

const router = express.Router();


router.post(
    "/",
    /* auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
    ), */
    validateRequest(OrderValidation.createCustomerOrder),
    OrderController.createCustomerOrder
);
router.get(
    "/",
    /* auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
    ), */
    OrderController.getAllOrders
);

export const OrderRoutes = router;