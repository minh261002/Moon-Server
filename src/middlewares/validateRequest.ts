import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';
import { AppError } from '@/utils/AppError';

type ZodSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validateRequest = (schemas: ZodSchemas) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (schemas.body) await schemas.body.parseAsync(req.body);
      if (schemas.query) await schemas.query.parseAsync(req.query);
      if (schemas.params) await schemas.params.parseAsync(req.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // Gửi lỗi với message đầu tiên, kèm theo mảng lỗi
        return next(new AppError(errors[0].message, 400, errors));
      }

      next(error);
    }
  };
};
