import express from 'express';
import { verifySupabaseToken } from '../middleware/supabaseAuthMiddleware.js';

const router = express.Router();

router.get('/profile', verifySupabaseToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
