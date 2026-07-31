import express from 'express';
import { handleGoogleLogin } from '../controllers/authController.js';

const router = express.Router();

// POST route for Google Auth verification
router.post('/google-login', handleGoogleLogin);

export default router;