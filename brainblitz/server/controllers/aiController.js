import { AppError } from '../middleware/errorHandler.js';

const XAI_URL = "https://api.x.ai/v1/chat/completions";

const callGrok = async (prompt) => {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    throw new Error("No API key");
  }

  const res = await fetch(XAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-2-latest", // ✅ working model
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  const data = await res.json();

  console.log("GROK FULL RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.error?.message || "API failed");
  }

  return data.choices?.[0]?.message?.content || "No response";
};

export const getHint = async (req, res, next) => {
  try {
    const { challengeTitle, userCode, language, hintLevel = 1, errorMessage } = req.body;

    const levels = {
      1: 'Give a 1-sentence vague directional hint. No code.',
      2: 'Explain the approach in 2-3 sentences. No code.',
      3: 'Give a near-solution hint with pseudocode.',
    };

    const hint = await callGrok(
      `You are a friendly mentor on BrainBlitz coding platform. 
Challenge: "${challengeTitle}" (${language}).

Student code:
\`\`\`
${userCode || '// empty'}
\`\`\`

${errorMessage ? `Error: ${errorMessage}` : ''}

${levels[hintLevel]}. Be encouraging, max 3 sentences.`
    );

    res.json({ success: true, hint });
  } catch (err) {
    next(err);
  }
};

export const explainCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;

    if (!code) throw new AppError('Code required', 400);

    const explanation = await callGrok(
      `Explain this ${language} code simply for a beginner. Max 4 sentences:

\`\`\`
${code}
\`\`\``
    );

    res.json({ success: true, explanation });
  } catch (err) {
    next(err);
  }
};

export const getRecommendation = async (req, res, next) => {
  try {
    const user = req.user;

    const weakest = Object.entries(user.skills || {}).sort(([, a], [, b]) => a - b)[0];

    const recommendation = await callGrok(
      `BrainBlitz student:
Level ${user.level}, ${user.xp} XP
Skills: ${JSON.stringify(user.skills)}

Weakest: ${weakest?.[0]} at ${weakest?.[1]}%

Give a 2-sentence encouraging learning recommendation.`
    );

    res.json({
      success: true,
      recommendation,
      weakestSkill: weakest?.[0],
    });
  } catch (err) {
    next(err);
  }
};