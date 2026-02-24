import express from 'express';
import { body } from 'express-validator';
import firebaseAuth from '../middleware/firebaseAuth.middleware.js';
import { register, getMe, updateProfile, deleteAccount } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', firebaseAuth, register);
router.get('/me', firebaseAuth, getMe);
router.put(
  '/update-profile',
  firebaseAuth,
  [body('name').optional().trim()],
  updateProfile
);
router.delete('/delete-account', firebaseAuth, deleteAccount);

export default router;
