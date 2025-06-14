import { Router } from 'express';
import {
  getUserByIdController,
  getUsersController,
  updateUserController,
  updateStatusUserController,
  deleteUserController,
} from '@/controllers/user.controller';
import { authenticate, authorize } from '@/middlewares/authMiddleware';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), getUsersController);
router.get('/:id', authenticate, authorize('ADMIN'), getUserByIdController);
router.put('/:id', authenticate, authorize('ADMIN'), updateUserController);
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  updateStatusUserController
);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUserController);
export default router;
