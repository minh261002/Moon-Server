import { Role } from '@/generated/prisma';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type RegisterResponse = {
  token: string;
};

export type SendEmailRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordRequest = {
  email: string;
  password: string;
};

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
