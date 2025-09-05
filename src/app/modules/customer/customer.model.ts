import { Schema, model } from 'mongoose';
import { CustomerModel, ICustomer } from './customer.interface';

export const CustomerSchema = new Schema<ICustomer, CustomerModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Customer = model<ICustomer, CustomerModel>('Customer', CustomerSchema);
