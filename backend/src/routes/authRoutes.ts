import { Router } from 'express';
import { loginController } from '../controllers/authController';
import rateLimit from "express-rate-limit";

const router = Router();

// NOTE: rate limiter is disabled for local dev/testing to prevent lockouts.
router.post('/login', loginController);

export default router;
