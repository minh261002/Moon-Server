import { Response } from 'express';
import { ApiResponse } from '@/types/api.type';

export class ApiResponseUtil {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    meta?: ApiResponse['meta']
  ): Response {
    const response: ApiResponse<T> = {
      status: 'success',
      message,
      data,
      meta,
    };
    return res.status(200).json(response);
  }

  static fail(
    res: Response,
    message: string = 'Bad Request',
    errors?: ApiResponse['errors'],
    statusCode: number = 400
  ): Response {
    const response: ApiResponse = {
      status: 'fail',
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    errors?: ApiResponse['errors'],
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      status: 'error',
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }
}
