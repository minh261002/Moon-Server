import { User } from '@/types/user.type';

import { prisma } from '@/lib/prisma';
import { Role } from '@/generated/prisma/client';
import { Prisma } from '@/generated/prisma';
import { AppError } from '@/utils/AppError';
import { BcryptUtil } from '@/utils/bcrypt';

export const getUsersService = async (
  keyword?: string,
  isActive?: boolean | string,
  role?: Role,
  page?: number,
  limit?: number
): Promise<User[]> => {
  const whereClause: Prisma.UserWhereInput = {};

  if (keyword) {
    whereClause.name = {
      contains: keyword,
    };
  }

  if (isActive !== undefined) {
    whereClause.isActive =
      typeof isActive === 'string'
        ? isActive.toLowerCase() === 'true'
        : isActive;
  }

  if (role) {
    whereClause.role = role;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const skip = pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : 0;
  const take = limitNumber ?? 10;

  const users = await prisma.user.findMany({
    where: whereClause,
    skip,
    take,
  });

  return users as User[];
};

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = user;
  return rest as User;
};

export const updateUserService = async (id: string, data: User) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  //nếu có password thì hash password
  if (data.password) {
    data.password = await BcryptUtil.hash(data.password);
  }

  //nếu có email thì kiểm tra email đã tồn tại chưa
  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }
  }

  //nếu có phone thì kiểm tra phone đã tồn tại chưa
  if (data.phone) {
    const existingUser = await prisma.user.findFirst({
      where: { phone: data.phone },
    });

    if (existingUser) {
      throw new AppError('Phone already exists', 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = updatedUser;

  return rest as User;
};

export const updateStatusUserService = async (
  id: string,
  isActive: boolean
) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      isActive,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = updatedUser;

  return rest as User;
};

export const deleteUserService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({
    where: { id: Number(id) },
  });
};
