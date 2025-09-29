
import { Schema, model } from 'mongoose';
import { ExpenseHeadModel, IExpenseHead } from './expenseHead.interface';

const ExpenseHeadSchema = new Schema<IExpenseHead, ExpenseHeadModel>(
  {
    title: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ExpenseHead = model<IExpenseHead, ExpenseHeadModel>('ExpenseHead', ExpenseHeadSchema);
