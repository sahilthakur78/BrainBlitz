import Challenge from '../models/Challenge.js';
import { Submission } from '../models/World.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { evaluateCode } from '../services/codeEvaluator.js';
import { checkAndAwardBadges } from '../services/badgeService.js';

export const getChallenges = async (req, res, next) => {
  try {
    const { worldId, language, difficulty, page = 1, limit = 20 } = req.query;
    const filter = { isPublished: true };
    if (worldId) filter.worldId = worldId;
    if (language) filter.language = language;
    if (difficulty) filter.difficulty = difficulty;
    const challenges = await Challenge.find(filter)
      .select('-solutionCode -testCases')
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Challenge.countDocuments(filter);
    res.json({ success: true, challenges, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const getChallenge = async (req, res, next) => {
  try {
    const isId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const challenge = await Challenge.findOne(
      isId ? { _id: req.params.id, isPublished: true } : { slug: req.params.id, isPublished: true }
    ).select('-solutionCode');
    if (!challenge) throw new AppError('Challenge not found', 404);
    res.json({ success: true, challenge });
  } catch (err) { next(err); }
};

export const submitChallenge = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) throw new AppError('Challenge not found', 404);
    const user = await User.findById(req.user.id);
    const alreadySolved = user.solvedChallenges.includes(challenge._id);

    const result = await evaluateCode(code, language, challenge.testCases, challenge.timeLimit);

    await Submission.create({
      userId: user._id, challengeId: challenge._id, code, language,
      status: result.passed ? 'accepted' : result.error ? 'error' : 'wrong',
      testsPassed: result.testsPassed, testsTotal: challenge.testCases.length,
      xpEarned: result.passed && !alreadySolved ? challenge.xpReward : 0,
      output: result.output, errorMessage: result.errorMessage,
    });

    challenge.attemptCount += 1;
    if (result.passed) challenge.solveCount += 1;
    await challenge.save();

    let newBadges = [];
    if (result.passed && !alreadySolved) {
      user.solvedChallenges.push(challenge._id);
      user.addXP(challenge.xpReward);
      const langKey = challenge.language === 'html' ? 'htmlcss' : challenge.language;
      if (user.skills[langKey] !== undefined) user.skills[langKey] = Math.min(100, user.skills[langKey] + 2);
      newBadges = await checkAndAwardBadges(user);
      await user.save();
      return res.json({ success: true, result, xpEarned: challenge.xpReward, newLevel: user.level, newBadges, firstSolve: true });
    }
    await user.save();
    res.json({ success: true, result, xpEarned: 0, firstSolve: false });
  } catch (err) { next(err); }
};

export const getHint = async (req, res, next) => {
  try {
    const { hintIndex = 0 } = req.body;
    const challenge = await Challenge.findById(req.params.id).select('hints');
    if (!challenge) throw new AppError('Challenge not found', 404);
    const hint = challenge.hints[hintIndex];
    if (!hint) throw new AppError('Hint not found', 404);
    const user = await User.findById(req.user.id);
    if (user.skillPoints < hint.cost) throw new AppError('Not enough skill points', 400);
    user.skillPoints -= hint.cost;
    await user.save();
    res.json({ success: true, hint: hint.text, skillPointsLeft: user.skillPoints });
  } catch (err) { next(err); }
};
