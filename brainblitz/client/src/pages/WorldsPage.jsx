import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWorlds, fetchChallenges, setActiveWorld } from '../store/slices/gameSlice.js';

const WS = {
  javascript: { color:'#F59E0B', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.25)', glow:'#F59E0B44' },
  python:     { color:'#3B82F6', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.25)',  glow:'#3B82F644' },
  cpp:        { color:'#EF4444', bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.25)',   glow:'#EF444444' },
  html:       { color:'#10B981', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.25)',  glow:'#10B98144' },
  dsa:        { color:'#8B5CF6', bg:'rgba(139,92,246,0.08)',  border:'rgba(139,92,246,0.25)',  glow:'#8B5CF644' },
};

export default function WorldsPage() {
  const dispatch = useDispatch();
  const { worlds, challenges, activeWorld } = useSelector(s => s.game);
  const { user } = useSelector(s => s.auth);

  useEffect(() => { dispatch(fetchWorlds()); dispatch(fetchChallenges({ limit: 50 })); }, []);

  const wc = activeWorld ? challenges.filter(c => c.language === activeWorld.language) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}>
        <h1 className="text-3xl font-display font-bold text-white">Game Worlds 🌍</h1>
        <p className="text-slate-500 text-sm mt-1">Pick your arena and start the adventure</p>
      </motion.div>

      {/* World cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {worlds.map((w,i) => {
          const st = WS[w.language]||WS.dsa;
          const isActive = activeWorld?._id === w._id;
          const langKey = w.language==='html'?'htmlcss':w.language;
          const prog = user?.skills?.[langKey]||0;
          const locked = (user?.level||1) < w.requiredLevel;
          return (
            <motion.button key={w._id} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
              onClick={() => !locked && dispatch(setActiveWorld(w))}
              className={`glass-card p-5 text-center relative overflow-hidden transition-all duration-200
                ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                ${isActive ? 'scale-105' : ''}`}
              style={{ borderColor:isActive?st.color:st.border, boxShadow:isActive?`0 0 24px ${st.glow}`:'none' }}>
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-900/70 rounded-2xl z-10">
                  <div className="text-center"><span className="text-2xl">🔒</span><p className="text-xs text-slate-500 mt-1">Lv {w.requiredLevel}</p></div>
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-sm font-bold"
                style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>{w.theme?.icon}</div>
              <p className="text-sm font-bold text-white">{w.name}</p>
              <p className="text-xs text-slate-500 mb-3 capitalize">{w.language}</p>
              <div className="xp-bar-bg h-1.5 mb-1">
                <div className="h-1.5 rounded-full" style={{ width:`${prog}%`, background:st.color }} />
              </div>
              <p className="text-xs" style={{ color:st.color }}>{prog}%</p>
            </motion.button>
          );
        })}
      </div>

      {/* Active world detail */}
      {activeWorld && (() => {
        const st = WS[activeWorld.language]||WS.dsa;
        return (
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>{activeWorld.theme?.icon}</div>
              <div>
                <h2 className="text-xl font-display font-bold" style={{ color:st.color }}>{activeWorld.name}</h2>
                <p className="text-xs text-slate-400">{activeWorld.description}</p>
              </div>
            </div>

            {/* Level map */}
            <div className="flex items-center gap-2 flex-wrap mb-6 p-4 bg-dark-800/50 rounded-xl">
              {Array.from({ length:activeWorld.totalLevels }).map((_,i) => {
                const ch = wc[i];
                const solved = ch && user?.solvedChallenges?.includes(ch._id);
                const isCurr = !solved && wc.slice(0,i).every(c => user?.solvedChallenges?.includes(c._id));
                return (
                  <div key={i} className="flex items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border
                      ${ch?.isBoss ? 'border-pink-500' : 'border-transparent'}`}
                      style={{
                        background: solved?`${st.color}22`:isCurr?`${st.color}18`:'rgba(255,255,255,0.03)',
                        borderColor: solved?st.color:isCurr?st.color:ch?.isBoss?'#f72585':'#1e293b',
                        color: solved?st.color:isCurr?st.color:ch?.isBoss?'#f72585':'#475569',
                        boxShadow: isCurr?`0 0 10px ${st.glow}`:'none',
                        transform: isCurr?'scale(1.15)':'scale(1)',
                      }}>
                      {ch?.isBoss?'👑':solved?'✓':i+1}
                    </div>
                    {i < activeWorld.totalLevels-1 && (
                      <div className="w-4 h-0.5 mx-0.5 rounded" style={{ background:solved?st.color:'#1e293b' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Challenge cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wc.length > 0 ? wc.map(c => {
                const solved = user?.solvedChallenges?.includes(c._id);
                return (
                  <Link key={c._id} to={`/challenge/${c._id}`}
                    className="p-4 rounded-xl border transition-all hover:scale-[1.02] group relative overflow-hidden"
                    style={{ background:st.bg, borderColor:solved?st.color:st.border }}>
                    {solved && <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background:st.color }}>✓</div>}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge-${c.difficulty}`}>{c.difficulty}</span>
                      {c.isBoss && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-900/30 text-pink-400 border border-pink-800/50 font-semibold">BOSS</span>}
                    </div>
                    <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{c.title}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-yellow-500 font-semibold">+{c.xpReward} XP</span>
                      {c.timeLimit && <span className="text-xs text-orange-400">⏱ {Math.round(c.timeLimit/1000)}s</span>}
                    </div>
                  </Link>
                );
              }) : <p className="text-slate-500 text-sm col-span-3">No challenges in this world yet.</p>}
            </div>
          </motion.div>
        );
      })()}

      {!activeWorld && worlds.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-16">
          <p className="text-5xl mb-3">👆</p>
          <p className="text-slate-400">Select a world above to explore its challenges</p>
        </motion.div>
      )}
    </div>
  );
}
