import { Role } from '@/generated/prisma/client';
import { z } from 'zod';

export const getUsersSchema = z.object({
  keyword: z.string().optional(),
  isActive: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
  role: z.nativeEnum(Role).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const getUserByIdSchema = z.object({
  id: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.string().optional(),
  isActive: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
  role: z.nativeEnum(Role).optional(),
  password: z.string().optional(),
});

export const updateStatusUserSchema = z.object({
  isActive: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
});
