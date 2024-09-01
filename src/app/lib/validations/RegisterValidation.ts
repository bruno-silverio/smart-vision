import { z } from 'zod';

export const registerFormSchema = z.object({
  name: z.string().min(2,  { message: 'Name is too short' }),
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(6, { message: 'Password must contain at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password must contain at least 6 characters.' }),
});