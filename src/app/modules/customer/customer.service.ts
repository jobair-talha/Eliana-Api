/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { RedisClient } from '../../../shared/redis';
import { User } from '../user/user.model';
import { customerSearchableFields, EVENT_CUSTOMER_UPDATED } from './customer.constant';
import { ICustomer, ICustomerFilters } from './customer.interface';
import { Customer } from './customer.model';

const getAllCustomers = async (
  filters: ICustomerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICustomer[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: customerSearchableFields.map(field => ({
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
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Customer.find(whereConditions)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Customer.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCustomer = async (id: string): Promise<ICustomer | null> => {
  const result = await Customer.findOne({ id })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty');
  return result;
};

const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>
): Promise<ICustomer | null> => {
  const isExist = await Customer.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found !');
  }

  const { name, ...customerData } = payload;

  const updatedCustomerData: Partial<ICustomer> = { ...customerData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<ICustomer>; // `name.fisrtName`
      (updatedCustomerData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Customer.findOneAndUpdate({ id }, updatedCustomerData, {
    new: true,
  })
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('academicSemester');
  ;

  if (result) {
    await RedisClient.publish(EVENT_CUSTOMER_UPDATED, JSON.stringify(result));
  }
  return result;
};

const deleteCustomer = async (id: string): Promise<ICustomer | null> => {
  // check if the customer is exist
  const isExist = await Customer.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete customer first
    const customer = await Customer.findOneAndDelete({ id }, { session });
    if (!customer) {
      throw new ApiError(404, 'Failed to delete customer');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return customer;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const CustomerService = {
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
