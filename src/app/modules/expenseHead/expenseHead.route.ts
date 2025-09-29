import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ExpenseHeadController } from './expenseHead.controller';
import { ExpenseHeadValidation } from './expenseHead.validation';
const router = express.Router();

router.post(
  '/',
  validateRequest(ExpenseHeadValidation.createExpenseHeadZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ExpenseHeadController.createExpenseHead
);
router.get(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ExpenseHeadController.getAllExpenseHeads
);
router.get(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ExpenseHeadController.getExpenseHead
);
router.patch(
  '/:id',
  validateRequest(ExpenseHeadValidation.updateExpenseHeadZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ExpenseHeadController.updateExpenseHead
);
router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ExpenseHeadController.deleteExpenseHead
);

export const ExpenseHeadRoutes = router;
