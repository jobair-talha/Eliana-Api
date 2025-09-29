import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { expenseHeadSearchableFields } from './expenseHead.constant';
import { IExpenseHead, IExpenseHeadFilters } from './expenseHead.interface';
import { ExpenseHead } from './expenseHead.model';

const createExpenseHead = async (
  payload: IExpenseHead,
): Promise<IExpenseHead | null> => {
  const result = await ExpenseHead.create(payload);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create expense head');
  }

  return result;
};

const getExpenseHead = async (id: string): Promise<IExpenseHead | null> => {
  const result = await ExpenseHead.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense head not found');
  }

  return result;
};
const getAllExpenseHeads = async (
  filters: IExpenseHeadFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IExpenseHead[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: expenseHeadSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await ExpenseHead.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await ExpenseHead.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const updateExpenseHead = async (
  id: string,
  payload: Partial<IExpenseHead>,
): Promise<IExpenseHead | null> => {
  const result = await ExpenseHead.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense head not found');
  }

  return result;
};

const deleteExpenseHead = async (id: string): Promise<IExpenseHead | null> => {
  const result = await ExpenseHead.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense head not found');
  }

  return result;
};

export const ExpenseHeadService = {
  createExpenseHead,
  getExpenseHead,
  updateExpenseHead,
  deleteExpenseHead,
  getAllExpenseHeads,
};
