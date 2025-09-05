import { Model } from 'mongoose';

export type ICustomer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  profileImage?: string;
};

export type CustomerModel = Model<ICustomer, Record<string, unknown>>;

export type ICustomerFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  mobile?: string;
};
