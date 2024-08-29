import express from 'express';
import { getUserProfile, loginUser, registerUser } from '../Controllers/authController.js';

const router = express.Router()

router.post('/register', registerUser)  
router.post('/login', loginUser)
router.get('/profile', getUserProfile)

export default router;