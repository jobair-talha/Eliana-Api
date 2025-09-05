import { z } from 'zod';

const updateCustomerZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      middleName: z.string().optional(),
    }),
    email: z.string().email().optional(),
    mobile: z.string().optional(),
    address: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const CustomerValidation = {
  updateCustomerZodSchema,
};
