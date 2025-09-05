import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { customerFilterableFields } from './customer.constant';
import { ICustomer } from './customer.interface';
import { CustomerService } from './customer.service';

const getSingleCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CustomerService.getSingleCustomer(id);

  sendResponse<ICustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer fetched successfully !',
    data: result,
  });
});

const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CustomerService.getAllCustomers(
    filters,
    paginationOptions
  );

  sendResponse<ICustomer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customers fetched successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await CustomerService.updateCustomer(id, updatedData);

  sendResponse<ICustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer updated successfully !',
    data: result,
  });
});
const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CustomerService.deleteCustomer(id);

  sendResponse<ICustomer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer deleted successfully !',
    data: result,
  });
});

export const CustomerController = {
  getSingleCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};
