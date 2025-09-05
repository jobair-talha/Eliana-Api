/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';
import { ICustomer } from '../customer/customer.interface';
import { IFaculty } from '../faculty/faculty.interface';

export type IUser = {
  id: string;
  role: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  customer?: Types.ObjectId | ICustomer;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
