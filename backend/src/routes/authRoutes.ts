import { Router } from 'express';
import { loginController } from '../controllers/authController';
import rateLimit from "express-rate-limit";

const router = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
  },
});

router.post('/login', loginRateLimiter, loginController);

export default router;
