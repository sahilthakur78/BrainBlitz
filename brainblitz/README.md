# 🧠 BrainBlitz — Learn Programming Through Games

A full-stack MERN application where users master coding through epic game worlds, boss battles, real-time 1v1 duels, and an AI mentor powered by Claude.

---

## ⚡ Quick Start (3 commands)

```bash
# 1. Install everything
npm run install:all

# 2. Set up your environment
cp server/.env.example server/.env
# Open server/.env and set MONGO_URI (required)

# 3. Seed the database and start
cd server && node seed/index.js && cd ..
npm run dev
```

Open **http://localhost:5173**

Demo login: `demo@brainblitz.dev` / `demo1234`

---

## 🔧 Requirements

- **Node.js** 18 or higher
- **MongoDB** — local (`mongodb://localhost:27017`) or [MongoDB Atlas](https://cloud.mongodb.com) (free)
- **npm** 9+

---



---

## 📂 Project Structure

```
brainblitz/
├── package.json                  ← root scripts (dev, install:all)
│
├── client/                       ← React + Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx               ← Router + route guards
│       ├── main.jsx              ← Entry point
│       ├── styles/globals.css    ← Neon/cyberpunk theme
│       ├── pages/
│       │   ├── LandingPage.jsx   ← Public hero page
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── Dashboard.jsx     ← Main hub (stats, worlds, challenges)
│       │   ├── WorldsPage.jsx    ← 5 game worlds + level map
│       │   ├── ChallengePage.jsx ← Monaco editor + AI mentor + results
│       │   ├── BattlePage.jsx    ← Real-time 1v1 battles
│       │   ├── LeaderboardPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── SkillTreePage.jsx
│       ├── store/
│       │   ├── index.js          ← Redux store
│       │   └── slices/
│       │       ├── authSlice.js
│       │       ├── gameSlice.js
│       │       └── battleSlice.js
│       ├── components/
│       │   ├── layout/Layout.jsx ← Sidebar navigation
│       │   └── shared/LoadingScreen.jsx
│       └── services/
│           ├── api.js            ← Axios + auth interceptors
│           └── socket.js         ← Socket.io client
│
└── server/                       ← Node + Express backend
    ├── index.js                  ← App entry + Socket.io setup
    ├── models/
    │   ├── User.js               ← User + XP/level/badges/streaks
    │   ├── Challenge.js          ← Challenges + test cases
    │   └── World.js              ← World + Battle + Submission models
    ├── controllers/
    │   ├── authController.js     ← Register, login, daily reward
    │   ├── challengeController.js← Submit + evaluate + XP award
    │   └── aiController.js       ← Claude AI hints/explanations
    ├── routes/                   ← Express routers for each resource
    ├── middleware/
    │   ├── auth.js               ← JWT protect middleware
    │   └── errorHandler.js       ← Global error handler
    ├── services/
    │   ├── codeEvaluator.js      ← JS sandbox + Judge0 for Python/C++
    │   └── badgeService.js       ← Auto badge detection
    ├── socket/
    │   └── battleSocket.js       ← Matchmaking + HP system + live sync
    └── seed/
        └── index.js              ← 5 worlds + 9 challenges + demo users
```

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| POST | `/api/auth/daily-reward` | Yes | Claim daily XP |
| GET | `/api/worlds` | Yes | All 5 game worlds |
| GET | `/api/challenges` | Yes | List challenges (filterable) |
| GET | `/api/challenges/:id` | Yes | Single challenge |
| POST | `/api/challenges/:id/submit` | Yes | Submit + evaluate code |
| POST | `/api/challenges/:id/hint` | Yes | Unlock a hint (costs SP) |
| POST | `/api/ai/hint` | Yes | AI mentor hint (Claude) |
| POST | `/api/ai/explain` | Yes | Explain user's code |
| POST | `/api/ai/recommend` | Yes | Personalized recommendation |
| GET | `/api/leaderboard` | Yes | Rankings (xp/battles/streak) |
| GET | `/api/users/profile/:username` | Yes | Public profile |
| PUT | `/api/users/profile` | Yes | Update profile |
| POST | `/api/users/unlock-skill` | Yes | Buy skill node |

---

## ⚔️ Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `find-battle` | Client→Server | Join matchmaking queue |
| `battle-found` | Server→Client | Match found, room ready |
| `countdown` | Server→Client | 5..4..3..2..1 |
| `battle-start` | Server→Client | Go! |
| `code-update` | Client→Server | Sync code to opponent |
| `opponent-code-update` | Server→Client | Receive opponent code |
| `battle-submit` | Client→Server | Submit solution |
| `hp-update` | Server→Client | HP changed for both |
| `battle-over` | Server→Client | Winner declared |
| `leave-battle` | Client→Server | Forfeit/leave room |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push project to GitHub
2. Import in Vercel → set **Root Directory** to `client`
3. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render
1. Create **Web Service** → set **Root Directory** to `server`
2. Build: `npm install` | Start: `node index.js`
3. Add all env vars from `.env.example`

### Database → MongoDB Atlas
1. Create free M0 cluster at [mongodb.com](https://mongodb.com)
2. Get connection string → set as `MONGO_URI`
3. Network Access → Allow `0.0.0.0/0`

---

## ➕ Adding More Challenges

In `server/seed/index.js`, add to the `getChallenges()` array:

```js
{
  title: 'My New Challenge',
  description: 'Write solution(n) that returns...',
  worldId: jsWorld._id,           // jsId / pyId / dsaId
  language: 'javascript',         // javascript | python | cpp | html | dsa
  gameType: 'speed',              // speed | puzzle | battle | design | strategy
  difficulty: 'medium',           // easy | medium | hard | boss
  xpReward: 100,
  timeLimit: 60000,               // ms, or omit for no limit
  starterCode: new Map([['javascript', 'function solution(n) {\n  \n}']]),
  testCases: [
    { input: '5', expectedOutput: '25', isHidden: false },
    { input: '0', expectedOutput: '0',  isHidden: true  },
  ],
  hints: [{ cost: 10, text: 'Think about multiplication.' }],
  tags: ['math'],
}
```

Then re-run: `cd server && node seed/index.js`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | Redux Toolkit |
| Editor | Monaco Editor (@monaco-editor/react) |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT |
| Realtime | Socket.io |
| AI Mentor | Anthropic Claude (claude-sonnet-4-6) |
| Code Execution | Function constructor (JS), Judge0 API (Python/C++) |
