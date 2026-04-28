import express from 'express';
import { protect } from '../middleware/auth.js';
import { Battle } from '../models/World.js';
const r = express.Router();

r.get('/history', protect, async (req, res, next) => {
  try {
    const battles = await Battle.find({ 'players.userId': req.user.id })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, battles });
  } catch (err) { next(err); }
});

export default r;
