import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
const r = express.Router();

r.get('/profile/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password -googleId -email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

r.put('/profile', protect, async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { bio, avatar }, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

r.post('/unlock-skill', protect, async (req, res, next) => {
  try {
    const { skillId, cost } = req.body;
    const user = await User.findById(req.user.id);
    if (user.skillPoints < cost) return res.status(400).json({ success: false, message: 'Not enough skill points' });
    if (user.unlockedSkills.includes(skillId)) return res.status(400).json({ success: false, message: 'Already unlocked' });
    user.skillPoints -= cost;
    user.unlockedSkills.push(skillId);
    await user.save();
    res.json({ success: true, skillPoints: user.skillPoints, unlockedSkills: user.unlockedSkills });
  } catch (err) { next(err); }
});

export default r;
