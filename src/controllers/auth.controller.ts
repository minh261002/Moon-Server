import { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SendEmailRequest,
  VerifyOtpRequest,
} from '@/types/auth.type';
import {
  loginService,
  registerService,
  resetPasswordService,
  sendEmailService,
  verifyOtpService,
} from '@/services/auth.service';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendEmailSchema,
  verifyOtpSchema,
} from '@/validations/auth.validation';
import { ApiResponseUtil } from '@/utils/apiResponse';

const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;
    const token = await loginService(email, password);
    return ApiResponseUtil.success(res, token, 'Login successful');
  } catch (error: any) {
    return ApiResponseUtil.error(res, error.message, error.errors);
  }
};

const registerHandler = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as RegisterRequest;
  const token = await registerService(email, password, name);
  return ApiResponseUtil.success(res, token, 'Registration successful');
};

const sendEmailHandler = async (req: Request, res: Response) => {
  const { email } = req.body as SendEmailRequest;
  await sendEmailService(email);
  return ApiResponseUtil.success(res, null, 'Email sent successfully');
};

const verifyOtpHandler = async (req: Request, res: Response) => {
  const { email, otp } = req.body as VerifyOtpRequest;
  await verifyOtpService(email, otp);
  return ApiResponseUtil.success(res, null, 'OTP verified successfully');
};

const resetPasswordHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body as ResetPasswordRequest;
  await resetPasswordService(email, password);
  return ApiResponseUtil.success(res, null, 'Password reset successfully');
};

export const loginController = [
  validateRequest({ body: loginSchema }),
  catchAsync(loginHandler),
];
export const registerController = [
  validateRequest({ body: registerSchema }),
  catchAsync(registerHandler),
];

export const sendEmailController = [
  validateRequest({ body: sendEmailSchema }),
  catchAsync(sendEmailHandler),
];

export const verifyOtpController = [
  validateRequest({ body: verifyOtpSchema }),
  catchAsync(verifyOtpHandler),
];

export const resetPasswordController = [
  validateRequest({ body: resetPasswordSchema }),
  catchAsync(resetPasswordHandler),
];
