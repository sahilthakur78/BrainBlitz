import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WORLDS = [
  { icon: 'JS',  label: 'Speed Arena',    sub: 'JavaScript',       color: '#F59E0B' },
  { icon: 'Py',  label: 'Puzzle Quest',   sub: 'Python',           color: '#3B82F6' },
  { icon: 'C++', label: 'Battle Arena',   sub: 'C++',              color: '#EF4444' },
  { icon: 'UI',  label: 'Design Studio',  sub: 'HTML / CSS',       color: '#10B981' },
  { icon: 'DS',  label: 'Strategy Map',   sub: 'Data Structures',  color: '#8B5CF6' },
];

const FEATURES = [
  { icon: '⚔️', title: 'Boss Battles',    color: '#f72585', desc: 'Defeat algorithmic bosses with correct code. Every passing test is an attack move.' },
  { icon: '🏆', title: '1v1 Duels',       color: '#ffd60a', desc: 'Challenge coders worldwide in real-time battles. Watch their code live. Win glory.' },
  { icon: '🌿', title: 'Skill Trees',     color: '#06d6a0', desc: 'Unlock abilities as you progress. Spend skill points to master new concepts.' },
  { icon: '🔥', title: 'Daily Streaks',   color: '#ff6b35', desc: 'Keep your streak alive and earn bonus XP every day. Consistency beats talent.' },
  { icon: '📊', title: 'Live Leaderboard',color: '#9d4edd', desc: 'See where you rank globally. Compete by XP, battle wins, or streak length.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 bg-grid overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-purple-900/20 sticky top-0 z-50 glass">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-display text-white"
            style={{ background: 'linear-gradient(135deg,#9d4edd,#4361ee)', boxShadow: '0 0 18px #9d4edd55' }}>BB</div>
          <span className="font-display font-bold text-xl text-gradient">BrainBlitz</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"    className="btn-ghost text-sm py-2 px-4">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-5">Play free →</Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative text-center px-6 pt-24 pb-16 overflow-hidden">
        {/* background glow orbs */}
        <div className="absolute top-10 left-1/4  w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,#9d4edd,transparent)', filter: 'blur(70px)' }} />
        <div className="absolute top-32 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.06]"
          style={{ background: 'radial-gradient(circle,#4cc9f0,transparent)', filter: 'blur(70px)' }} />

        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(157,78,221,0.12)', border: '1px solid rgba(157,78,221,0.4)', color: '#c084fc' }}>
            🎮 The future of coding education is here
          </span>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-[1.05]">
            <span className="text-white">Learn to code</span><br />
            <span className="text-gradient">through epic games</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            BrainBlitz turns programming into an adventure. Fight bosses with algorithms, battle
            coders in real-time duels, and level up with your personal AI mentor.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-9 py-4 text-base">
              Start your quest — free forever
            </Link>
            <Link to="/login" className="btn-ghost px-9 py-4 text-base">
              Already a player? Sign in
            </Link>
          </div>
          <p className="text-xs text-slate-600 mt-5">No credit card · 10,000+ players levelling up right now</p>
        </motion.div>
      </section>

      {/*World cards*/}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {WORLDS.map((w, i) => (
            <motion.div key={w.label}
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * i + 0.3 }}
              className="glass-card p-5 text-center hover:scale-105 transition-transform"
              style={{ borderColor: `${w.color}30` }}>
              <div className="w-13 h-13 w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center font-bold text-sm"
                style={{ background: `${w.color}18`, color: w.color, border: `1px solid ${w.color}40` }}>
                {w.icon}
              </div>
              <p className="text-sm font-bold text-white">{w.label}</p>
              <p className="text-xs text-slate-500 mt-1">{w.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-3xl font-display font-bold text-center text-white mb-10">
          Everything you need to <span className="text-gradient">level up</span>
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.45 }}
              className="glass-card p-6" style={{ borderColor: `${f.color}22` }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: f.color }}>{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*  CTA footer */}
      <section className="text-center px-6 pb-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          className="glass-card max-w-2xl mx-auto p-12">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to blitz your brain?</h2>
          <p className="text-slate-400 mb-8">Join thousands of coders who learn by playing. No boring lectures — just games, battles, and XP.</p>
          <Link to="/register" className="btn-primary px-10 py-4 text-base inline-block">
            Create free account →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
