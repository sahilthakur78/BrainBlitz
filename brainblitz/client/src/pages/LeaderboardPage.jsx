import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../services/api.js';

export default function LeaderboardPage() {
  const { user } = useSelector(s => s.auth);
  const [users,  setUsers]  = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [type,   setType]   = useState('xp');
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/leaderboard?type=${type}&limit=50`)
      .then(r => { setUsers(r.data.users); setMyRank(r.data.myRank); })
      .finally(() => setLoading(false));
  }, [type]);

  const MEDALS = ['🥇','🥈','🥉'];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}>
        <h1 className="text-3xl font-display font-bold text-white">Leaderboard 🏆</h1>
        <p className="text-slate-500 text-sm mt-1">Your rank: <span className="text-purple-400 font-semibold">#{myRank}</span></p>
      </motion.div>

      <div className="flex gap-2">
        {[{id:'xp',label:'XP'},{id:'battles',label:'Battles'},{id:'streak',label:'Streak'}].map(t => (
          <button key={t.id} onClick={() => setType(t.id)}
            className={`text-sm px-4 py-2 rounded-xl transition-all border ${type===t.id?'bg-purple-600/25 text-purple-300 border-purple-500/50':'text-slate-400 hover:text-white border-slate-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-purple-900/30 text-xs text-slate-600 uppercase tracking-wider">
          <span className="col-span-1">#</span>
          <span className="col-span-6">Player</span>
          <span className="col-span-3 text-right">{type==='xp'?'XP':type==='battles'?'Wins':'Streak'}</span>
          <span className="col-span-2 text-right">Level</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"/></div>
        ) : users.map((u,i) => {
          const isMe = u._id === user?._id;
          const val  = type==='xp'?u.xp?.toLocaleString():type==='battles'?u.battleStats?.wins:`${u.streak}d`;
          return (
            <motion.div key={u._id} initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.025 }}
              className={`grid grid-cols-12 gap-2 px-5 py-3.5 border-b border-purple-900/15 items-center transition-colors ${isMe?'bg-purple-900/20':'hover:bg-white/[0.02]'}`}>
              <span className="col-span-1 text-sm font-bold">{i<3?MEDALS[i]:<span className="text-slate-500">{i+1}</span>}</span>
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#9d4edd,#4361ee)' }}>{u.username?.[0]?.toUpperCase()}</div>
                <div>
                  <p className={`text-sm font-semibold ${isMe?'text-purple-300':'text-white'}`}>{u.username}{isMe&&<span className="text-xs text-slate-500 ml-1">(you)</span>}</p>
                  <div className="flex gap-1">{u.badges?.slice(0,3).map(b=><span key={b.id} className="text-xs">{b.icon}</span>)}</div>
                </div>
              </div>
              <span className="col-span-3 text-right font-mono text-sm text-yellow-400 font-semibold">{val}</span>
              <span className="col-span-2 text-right text-xs text-slate-500">Lv {u.level}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
