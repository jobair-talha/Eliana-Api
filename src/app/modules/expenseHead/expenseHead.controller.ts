import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { expenseHeadFilterableFields } from './expenseHead.constant';
import { IExpenseHead } from './expenseHead.interface';
import { ExpenseHeadService } from './expenseHead.service';

const createExpenseHead: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ExpenseHeadService.createExpenseHead(req.body);

    sendResponse<IExpenseHead>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Expense head created successfully!',
      data: result,
    });
  }
);

const getExpenseHead: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ExpenseHeadService.getExpenseHead(req.params.id);

    sendResponse<IExpenseHead>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Expense head retrieved successfully!',
      data: result,
    });
  }
);

const updateExpenseHead: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ExpenseHeadService.updateExpenseHead(
      req.params.id,
      req.body
    );

    sendResponse<IExpenseHead>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Expense head updated successfully!',
      data: result,
    });
  }
);
const getAllExpenseHeads = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ExpenseHeadService.getAllExpenseHeads(
    filters,
    paginationOptions
  );

  sendResponse<IExpenseHead[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense head list get successfully!",
    data: result.data,
    meta: result.meta,
  });
});
const deleteExpenseHead: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ExpenseHeadService.deleteExpenseHead(req.params.id);

    sendResponse<IExpenseHead>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Expense head deleted successfully!',
      data: result,
    });
  }
);


export const ExpenseHeadController = {
  createExpenseHead,
  getExpenseHead,
  updateExpenseHead,
  deleteExpenseHead,
  getAllExpenseHeads,
};
