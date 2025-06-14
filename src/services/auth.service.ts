import { LoginResponse, RegisterResponse } from '@/types/auth.type';

import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/AppError';
import { BcryptUtil } from '@/utils/bcrypt';
import { JwtUtil } from '@/utils/jwt';
import { sendEmail } from '@/utils/sendMail';

export const loginService = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await BcryptUtil.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = JwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  } catch (error) {
    throw new AppError('Invalid email or password', 401);
  }
};

export const registerService = async (
  email: string,
  password: string,
  name: string
): Promise<RegisterResponse> => {
  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    throw new AppError('Email already registered', 400, [
      { field: 'email', message: 'Email already registered' },
    ]);
  }

  const hashedPassword = await BcryptUtil.hash(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const token = JwtUtil.generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return { token };
};

export const sendEmailService = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000);

  //check if otp exists
  const otpExists = await prisma.userOtp.findFirst({
    where: { email },
  });

  if (otpExists && otpExists.expiresAt > new Date()) {
    throw new AppError('Please wait 5 minutes before requesting again', 400);
  }

  if (otpExists && otpExists.expiresAt < new Date()) {
    await prisma.userOtp.delete({ where: { id: otpExists.id } });
  }

  await prisma.userOtp.create({
    data: {
      email,
      otp: code.toString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 5), //5 minutes
    },
  });

  await sendEmail({
    to: email,
    subject: 'Forgot Password',
    template: {
      name: 'forgot-password',
      variables: {
        code: code.toString(),
        description:
          'We received a request to reset your password. Don’t worry, we are here to help you.',
        otpText: `Your OTP is`,
      },
    },
  });
};

export const verifyOtpService = async (email: string, otp: string) => {
  const otpExists = await prisma.userOtp.findFirst({
    where: { email, otp },
  });

  if (!otpExists) {
    throw new AppError('Invalid OTP', 400);
  }

  if (otpExists.expiresAt < new Date()) {
    throw new AppError('OTP expired', 400);
  }

  if (otpExists.isVerified) {
    throw new AppError('OTP already verified', 400);
  }

  await prisma.userOtp.update({
    where: { id: otpExists.id },
    data: { isVerified: true },
  });
};

export const resetPasswordService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const otpExists = await prisma.userOtp.findFirst({
    where: { email, isVerified: true },
  });

  if (!otpExists) {
    throw new AppError('User not verified OTP', 400);
  }

  const hashedPassword = await BcryptUtil.hash(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  await prisma.userOtp.delete({ where: { id: otpExists.id } });
};
