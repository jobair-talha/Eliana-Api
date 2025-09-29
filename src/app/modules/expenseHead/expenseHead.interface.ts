
import { Model } from 'mongoose';

export type IExpenseHead = {

  title: string;

};

export type ExpenseHeadModel = Model<IExpenseHead, Record<string, unknown>>;

export type IExpenseHeadFilters = {
  searchTerm?: string;
};