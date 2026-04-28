import express from 'express';
import { protect } from '../middleware/auth.js';
import { getHint, explainCode, getRecommendation } from '../controllers/aiController.js';
const r = express.Router();
r.post('/hint', protect, getHint);
r.post('/explain', protect, explainCode);
r.post('/recommend', protect, getRecommendation);
export default r;
