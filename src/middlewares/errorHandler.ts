import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Helper: Capitalize chữ cái đầu
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// ✅ Handle lỗi Prisma: unique constraint
const handlePrismaError = (err: PrismaClientKnownRequestError): AppError => {
  if (err.code === 'P2002') {
    const target = err.meta?.target as string[] | undefined;
    const field = target?.[0] || 'unknown';
    return new AppError(`${capitalize(field)} already exists.`, 400, [
      { field, message: 'Duplicate field' },
    ]);
  }

  return new AppError('Database error', 500);
};

// ✅ Handle lỗi JWT
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// ✅ Gửi lỗi ở môi trường dev
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message, // ✅ Dùng message từ lỗi gốc
    stack: err.stack,
    errors: err.errors ?? null,
  });
};

// ✅ Gửi lỗi ở môi trường production
const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  console.error('💥 UNEXPECTED ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

// ✅ Main Error Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = err;

  // Clone error nếu không phải AppError
  if (process.env.NODE_ENV === 'production') {
    // Prisma error
    if (err instanceof PrismaClientKnownRequestError) {
      error = handlePrismaError(err);
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    return sendErrorProd(error, res);
  }

  // Dev mode
  return sendErrorDev(error, res);
};
