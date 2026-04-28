import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, minlength: 6, select: false },
  googleId:  { type: String },
  avatar:    { type: String, default: '' },
  bio:       { type: String, default: '', maxlength: 200 },
  xp:        { type: Number, default: 0 },
  level:     { type: Number, default: 1 },
  skillPoints: { type: Number, default: 0 },
  streak:    { type: Number, default: 0 },
  lastLoginAt:   { type: Date, default: Date.now },
  lastDailyReward: { type: Date },
  skills: {
    javascript: { type: Number, default: 0 },
    python:     { type: Number, default: 0 },
    cpp:        { type: Number, default: 0 },
    htmlcss:    { type: Number, default: 0 },
    dsa:        { type: Number, default: 0 },
  },
  unlockedSkills: [{ type: String }],
  badges: [{
    id: String, name: String, icon: String,
    earnedAt: { type: Date, default: Date.now },
  }],
  worldProgress: [{
    worldId:      { type: mongoose.Schema.Types.ObjectId, ref: 'World' },
    currentLevel: { type: Number, default: 1 },
    completed:    { type: Boolean, default: false },
  }],
  solvedChallenges:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  bookmarkedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  battleStats: {
    wins:         { type: Number, default: 0 },
    losses:       { type: Number, default: 0 },
    totalBattles: { type: Number, default: 0 },
  },
  role:     { type: String, enum: ['user','admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const XP_THRESHOLDS = [0,100,250,500,900,1400,2000,2700,3500,4400,5500,6700,8000,9500,11000,13000,15000,17500,20000,23000];

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  this.skillPoints += Math.floor(amount / 10);
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (this.xp >= XP_THRESHOLDS[i]) { this.level = i + 1; break; }
  }
};

userSchema.methods.updateStreak = function() {
  const now = new Date();
  const diffHours = this.lastLoginAt ? (now - this.lastLoginAt) / 3600000 : 999;
  if (diffHours > 48) this.streak = 1;
  else if (diffHours > 20) this.streak += 1;
  this.lastLoginAt = now;
};

export default mongoose.model('User', userSchema);
