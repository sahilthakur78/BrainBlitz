import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const u = user.toObject ? user.toObject() : { ...user };
  delete u.password;
  res.status(statusCode).json({ success: true, token, user: u });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) throw new AppError('Please provide username, email and password', 400);
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) throw new AppError('Email or username already taken', 400);
    const user = await User.create({ username, email, password });
    sendToken(user, 201, res);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password required', 400);
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid credentials', 401);
    user.updateStreak();
    await user.save({ validateBeforeSave: false });
    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('worldProgress.worldId', 'name language theme')
      .populate('solvedChallenges', 'title difficulty xpReward');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

export const claimDailyReward = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    if (user.lastDailyReward && now - user.lastDailyReward < 20 * 3600 * 1000)
      throw new AppError('Already claimed today', 400);
    const xp = 50 + (user.streak * 10);
    user.addXP(xp);
    user.lastDailyReward = now;
    await user.save();
    res.json({ success: true, xpEarned: xp, newXP: user.xp, streak: user.streak });
  } catch (err) { next(err); }
};
