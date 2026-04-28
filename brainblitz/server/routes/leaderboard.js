import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
const r = express.Router();

r.get('/', protect, async (req, res, next) => {
  try {
    const { type = 'xp', limit = 50 } = req.query;
    const sortField = type === 'battles' ? 'battleStats.wins' : type === 'streak' ? 'streak' : 'xp';
    const users = await User.find({ isActive: true })
      .select('username avatar xp level streak battleStats skills badges')
      .sort({ [sortField]: -1 })
      .limit(Number(limit));
    const myVal = req.user[sortField] || 0;
    const myRank = await User.countDocuments({ [sortField]: { $gt: myVal } }) + 1;
    res.json({ success: true, users, myRank });
  } catch (err) { next(err); }
});

export default r;
