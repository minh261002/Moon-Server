import { User } from '@/types/auth.type';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
