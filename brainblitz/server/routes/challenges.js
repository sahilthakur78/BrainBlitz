import express from 'express';
import { protect } from '../middleware/auth.js';
import { getChallenges, getChallenge, submitChallenge, getHint } from '../controllers/challengeController.js';
const r = express.Router();
r.get('/', protect, getChallenges);
r.get('/:id', protect, getChallenge);
r.post('/:id/submit', protect, submitChallenge);
r.post('/:id/hint', protect, getHint);
export default r;
