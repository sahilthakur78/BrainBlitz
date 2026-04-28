import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchWorlds, fetchChallenges } from '../store/slices/gameSlice.js';
import { claimDailyReward } from '../store/slices/authSlice.js';

const WS = {
  javascript: { color: '#F59E0B', border: 'rgba(245,158,11,0.28)' },
  python:     { color: '#3B82F6', border: 'rgba(59,130,246,0.28)'  },
  cpp:        { color: '#EF4444', border: 'rgba(239,68,68,0.28)'   },
  html:       { color: '#10B981', border: 'rgba(16,185,129,0.28)'  },
  dsa:        { color: '#8B5CF6', border: 'rgba(139,92,246,0.28)'  },
};

const XP_T = [0,100,250,500,900,1400,2000,2700,3500,4400,5500];
const fade  = (d=0) => ({ initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0 }, transition:{ delay:d, duration:0.4 } });

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { worlds, challenges } = useSelector(s => s.game);

  useEffect(() => { dispatch(fetchWorlds()); dispatch(fetchChallenges({ limit: 6 })); }, []);

  const handleDaily = async () => {
    const r = await dispatch(claimDailyReward());
    if (!r.error) toast.success(`+${r.payload.xpEarned} XP! Day ${r.payload.streak} streak! 🔥`);
    else toast.error(r.payload || 'Already claimed today');
  };

  const lvl  = user?.level || 1;
  const curr = XP_T[Math.min(lvl-1, XP_T.length-1)] || 0;
  const next = XP_T[Math.min(lvl,   XP_T.length-1)] || curr+500;
  const pct  = Math.min(100, Math.round((((user?.xp||0)-curr)/(next-curr))*100));
  const wr   = user?.battleStats?.totalBattles
    ? Math.round((user.battleStats.wins / user.battleStats.totalBattles) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Hey, <span className="text-gradient">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Level {user?.level} · {(user?.xp||0).toLocaleString()} XP · {user?.streak||0}-day streak 🔥
          </p>
        </div>
        <button onClick={handleDaily} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          🎁 Claim Daily Reward
        </button>
      </motion.div>

      {/* XP bar */}
      <motion.div {...fade(0.05)} className="glass-card p-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Level {lvl}</span>
          <span>{(user?.xp||0).toLocaleString()} / {next.toLocaleString()} XP — {pct}% to next level</span>
          <span>Level {lvl+1}</span>
        </div>
        <div className="xp-bar-bg h-3">
          <motion.div className="xp-bar h-3" initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:1, delay:0.2 }} />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Challenges solved', value: user?.solvedChallenges?.length||0,     icon:'✅', color:'#06d6a0' },
          { label:'Global rank',       value: `#${user?.rank||'—'}`,                  icon:'🏆', color:'#ffd60a' },
          { label:'Battle wins',       value: user?.battleStats?.wins||0,             icon:'⚔️', color:'#f72585' },
          { label:'Win rate',          value: `${wr}%`,                               icon:'🎯', color:'#4cc9f0' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className="text-2xl">{s.icon}</span>
            <span className="text-3xl font-bold font-display" style={{ background:`linear-gradient(135deg,#e2e8f0,${s.color})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {s.value}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Worlds */}
        <motion.div {...fade(0.15)} className="md:col-span-3 space-y-3">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">🌍 Game Worlds</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {worlds.slice(0,4).map(w => {
              const st = WS[w.language] || WS.dsa;
              const prog = user?.skills?.[w.language==='html'?'htmlcss':w.language] || 0;
              return (
                <Link key={w._id} to="/worlds"
                  className="glass-card p-4 hover:scale-[1.02] transition-transform block group"
                  style={{ borderColor: st.border }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background:`${st.color}15`, color:st.color, border:`1px solid ${st.color}35` }}>
                      {w.theme?.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{w.name}</p>
                      <p className="text-xs text-slate-500">{w.totalLevels} levels</p>
                    </div>
                  </div>
                  <div className="xp-bar-bg h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width:`${prog}%`, background:st.color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color:st.color }}>{prog}% mastery</p>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div {...fade(0.2)} className="md:col-span-2 space-y-4">
          {/* Skills */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">📊 Skill Progress</h3>
            <div className="space-y-3">
              {[
                { key:'javascript', label:'JavaScript', color:'#F59E0B' },
                { key:'python',     label:'Python',     color:'#3B82F6' },
                { key:'cpp',        label:'C++',        color:'#EF4444' },
                { key:'htmlcss',    label:'HTML / CSS', color:'#10B981' },
                { key:'dsa',        label:'Data Structures', color:'#8B5CF6' },
              ].map(sk => {
                const val = user?.skills?.[sk.key] || 0;
                return (
                  <div key={sk.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{sk.label}</span>
                      <span style={{ color:sk.color }}>{val}%</span>
                    </div>
                    <div className="xp-bar-bg h-1.5">
                      <motion.div className="h-1.5 rounded-full" initial={{ width:0 }} animate={{ width:`${val}%` }}
                        transition={{ duration:0.8, delay:0.3 }} style={{ background:sk.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">🏅 Badges</h3>
            {user?.badges?.length ? (
              <div className="flex flex-wrap gap-2">
                {user.badges.map(b => (
                  <span key={b.id} title={b.name}
                    className="text-2xl cursor-default hover:scale-125 transition-transform inline-block">{b.icon}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Complete challenges to earn badges!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent challenges */}
      <motion.div {...fade(0.25)}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">🎮 Challenges</h2>
          <Link to="/worlds" className="text-xs text-purple-400 hover:text-purple-300">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {challenges.slice(0,6).map(c => (
            <Link key={c._id} to={`/challenge/${c._id}`}
              className="glass-card p-4 hover:scale-[1.02] transition-transform group">
              <div className="flex justify-between items-start mb-2">
                <span className={`badge-${c.difficulty}`}>{c.difficulty}</span>
                <span className="text-xs text-yellow-500 font-semibold">+{c.xpReward} XP</span>
              </div>
              <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{c.title}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{c.language} · {c.gameType}</p>
              {c.timeLimit && <p className="text-xs text-orange-400 mt-1">⏱ {Math.round(c.timeLimit/1000)}s limit</p>}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
