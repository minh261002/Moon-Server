import { Role } from '@/generated/prisma/client';

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  phone: string;
  image: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  reward: number;
  isActive: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFilter = {
  keyword?: string;
  isActive?: boolean;
  role?: Role;
  page?: number;
  limit?: number;
};
