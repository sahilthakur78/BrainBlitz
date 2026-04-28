// routes/auth.js
import express from 'express';
import { register, login, getMe, claimDailyReward } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const r = express.Router();
r.post('/register', register);
r.post('/login', login);
r.get('/me', protect, getMe);
r.post('/daily-reward', protect, claimDailyReward);
export default r;
