import mongoose from 'mongoose';

const worldSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, unique: true },
  language:    { type: String, enum: ['javascript','python','cpp','html','dsa'], required: true },
  gameType:    { type: String, enum: ['speed','puzzle','battle','design','strategy'], required: true },
  description: String,
  theme: {
    primaryColor:   String,
    secondaryColor: String,
    icon:           String,
    bgClass:        String,
  },
  totalLevels:   { type: Number, default: 12 },
  requiredLevel: { type: Number, default: 1 },
  order:         { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

export const World = mongoose.model('World', worldSchema);

const battleSchema = new mongoose.Schema({
  roomId:  { type: String, unique: true, required: true },
  players: [{
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    avatar:   String,
    hp:       { type: Number, default: 100 },
    ready:    { type: Boolean, default: false },
    solvedAt: Date,
    code:     String,
  }],
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  status:      { type: String, enum: ['waiting','countdown','active','finished'], default: 'waiting' },
  winnerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startedAt:   Date,
  endedAt:     Date,
  duration:    Number,
}, { timestamps: true });

export const Battle = mongoose.model('Battle', battleSchema);

const submissionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  code:        { type: String, required: true },
  language:    String,
  status:      { type: String, enum: ['accepted','wrong','error','timeout'], required: true },
  testsPassed: { type: Number, default: 0 },
  testsTotal:  { type: Number, default: 0 },
  xpEarned:    { type: Number, default: 0 },
  timeTaken:   Number,
  output:      String,
  errorMessage:String,
}, { timestamps: true });

export const Submission = mongoose.model('Submission', submissionSchema);
