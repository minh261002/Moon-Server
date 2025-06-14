import { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import { UserFilter } from '@/types/user.type';
import {
  getUsersService,
  getUserByIdService,
  updateUserService,
  updateStatusUserService,
  deleteUserService,
} from '@/services/user.service';
import { validateRequest } from '@/middlewares/validateRequest';
import { ApiResponseUtil } from '@/utils/apiResponse';
import {
  getUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
  updateStatusUserSchema,
} from '@/validations/user.validation';

const getUsersHandler = async (req: Request, res: Response) => {
  const { keyword, isActive, role, page, limit } =
    req.query as unknown as UserFilter;
  const users = await getUsersService(keyword, isActive, role, page, limit);
  return ApiResponseUtil.success(res, users, 'Users fetched successfully');
};

const getUserByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserByIdService(id);
  return ApiResponseUtil.success(res, user, 'User fetched successfully');
};

const updateUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await updateUserService(id, req.body);
  return ApiResponseUtil.success(res, user, 'User updated successfully');
};

const updateStatusUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await updateStatusUserService(id, isActive);
  return ApiResponseUtil.success(res, user, 'User status updated successfully');
};

const deleteUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUserService(id);
  return ApiResponseUtil.success(res, null, 'User deleted successfully');
};

export const getUsersController = [
  validateRequest({ query: getUsersSchema }),
  catchAsync(getUsersHandler),
];

export const getUserByIdController = [
  validateRequest({ params: getUserByIdSchema }),
  catchAsync(getUserByIdHandler),
];

export const updateUserController = [
  validateRequest({ body: updateUserSchema, params: getUserByIdSchema }),
  catchAsync(updateUserHandler),
];

export const updateStatusUserController = [
  validateRequest({ body: updateStatusUserSchema, params: getUserByIdSchema }),
  catchAsync(updateStatusUserHandler),
];

export const deleteUserController = [
  validateRequest({ params: getUserByIdSchema }),
  catchAsync(deleteUserHandler),
];
