import { Router } from 'express';
import {
  loginController,
  registerController,
  sendEmailController,
  verifyOtpController,
  resetPasswordController,
  getMeController,
} from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/authMiddleware';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/password/forgot', sendEmailController);
router.post('/password/verify', verifyOtpController);
router.post('/password/reset', resetPasswordController);
router.get('/me', authenticate, getMeController);

export default router;
