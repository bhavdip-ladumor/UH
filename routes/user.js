// user.js
import express from 'express';
import { getUserProfile, updateUserProfile, getUserAddress, updateUserAddress } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile/:id', getUserProfile);
router.post('/profile', updateUserProfile);

// ADD THESE TWO LINES
router.get('/address/:id', getUserAddress);
router.post('/address', updateUserAddress);

export default router;