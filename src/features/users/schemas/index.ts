import * as z from 'zod';

import { Gender } from '../types';

/**
 * Common user fields.
 */
export const userFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .max(100, 'First name must be at most 100 characters'),

  last_name: z
    .string()
    .trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(100, 'Last name must be at most 100 characters'),

  gender: z.nativeEnum(Gender),

  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must be at most 100 characters')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'Username can only contain letters, numbers, underscores, dots, and hyphens',
    ),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email'),

  phone_number: z
    .string()
    .trim()
    .min(10, 'Please enter a valid phone number')
    .max(15, 'Phone number must be at most 15 characters')
    .nullable()
    .optional(),
});

/**
 * Create user validation.
 *
 * Matches the backend CreateUser schema:
 * - first_name: required, 3-100 characters
 * - last_name: required, 3-100 characters
 * - username: required, 3-100 characters
 * - email: required, valid email
 * - phone_number: optional/null, max 15 characters
 * - password: optional/null, 8-128 characters
 */
export const createUserSchema = userFormSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .optional()
    .nullable(),
});

/**
 * Edit user validation.
 *
 * All user fields are optional for PATCH requests.
 */
export const editUserSchema = userFormSchema
  .extend({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .optional()
      .nullable(),
  })
  .partial();

export type UserFormValues = z.infer<typeof userFormSchema>;

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export type EditUserFormValues = z.infer<typeof editUserSchema>;