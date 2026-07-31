import express from 'express';
const router = express.Router();
// Import your controller (we will create this next)
import { loginSeller } from './authController.js';

// URL path: /api/ecom/auth/login
router.post('/login', loginSeller);

export default router;