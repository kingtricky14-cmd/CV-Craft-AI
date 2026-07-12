import { Router } from 'express';
import { register, login, forgotPassword, me, updateProfile, deleteAccount } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateProfile);
router.delete('/me', requireAuth, deleteAccount);

export default router;
