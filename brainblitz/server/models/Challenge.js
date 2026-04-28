import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  description: { type: String, required: true },
  worldId:     { type: mongoose.Schema.Types.ObjectId, ref: 'World' },
  levelNumber: { type: Number },
  difficulty:  { type: String, enum: ['easy','medium','hard','boss'], default: 'easy' },
  language:    { type: String, enum: ['javascript','python','cpp','html','dsa'], required: true },
  gameType:    { type: String, enum: ['speed','puzzle','battle','design','strategy'], required: true },
  xpReward:    { type: Number, default: 50 },
  timeLimit:   { type: Number, default: null },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    description: String,
  }],
  starterCode:  { type: Map, of: String },
  solutionCode: { type: Map, of: String },
  hints: [{ cost: { type: Number, default: 10 }, text: String }],
  tags:         [String],
  isBoss:       { type: Boolean, default: false },
  isPublished:  { type: Boolean, default: true },
  solveCount:   { type: Number, default: 0 },
  attemptCount: { type: Number, default: 0 },
  order:        { type: Number, default: 0 },
}, { timestamps: true });

challengeSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }
  next();
});

export default mongoose.model('Challenge', challengeSchema);
