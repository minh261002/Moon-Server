import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_CONFIG } from '@/config/jwt';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export class JwtUtil {
  static generateToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: JWT_CONFIG.expiresIn as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, JWT_CONFIG.secret, options);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: JWT_CONFIG.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, JWT_CONFIG.secret, options);
  }

  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_CONFIG.secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
