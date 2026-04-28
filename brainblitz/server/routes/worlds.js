import express from 'express';
import { protect } from '../middleware/auth.js';
import { World } from '../models/World.js';
const r = express.Router();

r.get('/', protect, async (req, res, next) => {
  try {
    const worlds = await World.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, worlds });
  } catch (err) { next(err); }
});

r.get('/:id/challenges', protect, async (req, res, next) => {
  try {
    const Challenge = (await import('../models/Challenge.js')).default;
    const challenges = await Challenge.find({ worldId: req.params.id, isPublished: true })
      .select('-solutionCode').sort({ order: 1 });
    res.json({ success: true, challenges });
  } catch (err) { next(err); }
});

export default r;
