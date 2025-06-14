import { Router } from 'express';
import {
  loginController,
  registerController,
  sendEmailController,
  verifyOtpController,
  resetPasswordController,
} from '@/controllers/auth.controller';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/password/forgot', sendEmailController);
router.post('/password/verify', verifyOtpController);
router.post('/password/reset', resetPasswordController);

export default router;
