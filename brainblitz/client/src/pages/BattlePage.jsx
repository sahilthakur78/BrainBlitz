// BattlePage.jsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { getSocket, connectSocket } from '../services/socket.js';
import { setSearching, setBattleFound, setCountdown, setBattleActive, updateHP, setBattleOver, setOpponentCode, resetBattle } from '../store/slices/battleSlice.js';
import { submitChallenge } from '../store/slices/gameSlice.js';

export function BattlePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const battle = useSelector(s => s.battle);
  const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n  \n}');
  const socketRef = useRef(null);

  useEffect(() => {
    connectSocket();
    socketRef.current = getSocket();
    const s = socketRef.current;
    s.on('battle-found',   d  => { dispatch(setBattleFound(d)); if(d.challenge?.starterCode?.[d.challenge.language]) setCode(d.challenge.starterCode[d.challenge.language]); toast.success('Opponent found!'); });
    s.on('countdown',      n  => dispatch(setCountdown(n)));
    s.on('battle-start',   () => { dispatch(setBattleActive()); toast('⚔️ Battle started!'); });
    s.on('hp-update',      d  => dispatch(updateHP(d)));
    s.on('battle-over',    d  => { dispatch(setBattleOver(d)); toast(d.winnerId===user?._id?'🏆 You won!':'💀 You lost!', { duration:5000 }); });
    s.on('opponent-code-update', d => dispatch(setOpponentCode(d)));
    s.on('in-queue',       d  => toast(`Searching... #${d.position} in queue`));
    return () => { ['battle-found','countdown','battle-start','hp-update','battle-over','opponent-code-update','in-queue'].forEach(e => s.off(e)); };
  }, []);

  const findBattle = () => { dispatch(setSearching()); socketRef.current.emit('find-battle', { userId:user._id, username:user.username }); };

  const handleSubmit = () => {
    if (!code.trim()) return;
    dispatch(submitChallenge({ id:battle.challenge?._id, code, language:battle.challenge?.language })).then(r => {
      const res = r.payload?.result;
      socketRef.current.emit('battle-submit', { roomId:battle.roomId, userId:user._id, testsPassed:res?.testsPassed||0, testsTotal:res?.testsTotal||1, code });
    });
  };

  const opponentPlayer = battle.players?.find(p => p.userId !== user?._id);

  const HPBar = ({ hp, color }) => (
    <div className="xp-bar-bg h-3 mt-2">
      <motion.div className="h-3 rounded-full" animate={{ width:`${hp}%` }}
        style={{ background: hp>50?'#06d6a0':hp>25?'#ffd60a':'#ef233c' }} />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} className="flex items-center justify-between">
        <div><h1 className="text-3xl font-display font-bold text-white">Battle Mode ⚔️</h1><p className="text-slate-500 text-sm mt-1">Real-time 1v1 coding duels</p></div>
        {battle.status !== 'idle' && <button onClick={() => { socketRef.current.emit('leave-battle',{roomId:battle.roomId}); dispatch(resetBattle()); }} className="btn-danger text-sm px-4 py-2">Leave</button>}
      </motion.div>

      {battle.status==='idle' && (
        <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }} className="glass-card p-14 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-6">⚔️</div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">Enter the Arena</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">Challenge a random coder in real-time. First to solve the challenge wins XP and glory.</p>
          <button onClick={findBattle} className="btn-primary px-10 py-4 text-base">Find Opponent →</button>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[{label:'Wins',val:user?.battleStats?.wins||0},{label:'Battles',val:user?.battleStats?.totalBattles||0},{label:'Win Rate',val:user?.battleStats?.totalBattles?`${Math.round((user.battleStats.wins/user.battleStats.totalBattles)*100)}%`:'—'}].map(s=>(
              <div key={s.label} className="glass-card p-3 text-center"><p className="text-lg font-bold text-white">{s.val}</p><p className="text-xs text-slate-500">{s.label}</p></div>
            ))}
          </div>
        </motion.div>
      )}

      {battle.status==='searching' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="glass-card p-14 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-display font-bold text-white mb-2">Finding opponent...</h2>
          <p className="text-slate-400 text-sm">Matching you with a coder of similar level</p>
        </motion.div>
      )}

      {battle.status==='countdown' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="glass-card p-14 text-center max-w-lg mx-auto">
          <h2 className="text-xl font-display font-bold text-white mb-4">Battle starting in...</h2>
          <motion.div key={battle.countdown} initial={{ scale:2,opacity:0 }} animate={{ scale:1,opacity:1 }} className="text-8xl font-display font-bold text-gradient mb-4">{battle.countdown}</motion.div>
          <p className="text-slate-400 text-sm">Challenge: <span className="text-white font-semibold">{battle.challenge?.title}</span></p>
        </motion.div>
      )}

      {(battle.status==='active'||battle.status==='finished') && (
        <div className="space-y-4">
          <div className="glass-card p-5 grid grid-cols-3 gap-4 items-center">
            <div>
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">{user?.username?.[0]?.toUpperCase()}</div><span className="text-sm font-semibold text-white">{user?.username}</span><span className="text-xs text-slate-500">(you)</span></div>
              <HPBar hp={battle.myHP} /><p className="text-xs text-slate-500 mt-1">{battle.myHP} HP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gradient">VS</p>
              {battle.status==='finished'&&<p className={`text-sm font-bold mt-1 ${battle.winnerId===user?._id?'text-green-400':'text-red-400'}`}>{battle.winnerId===user?._id?'🏆 YOU WON!':'💀 You lost'}</p>}
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2"><span className="text-sm font-semibold text-white">{opponentPlayer?.username||'Opponent'}</span><div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">{opponentPlayer?.username?.[0]?.toUpperCase()||'?'}</div></div>
              <HPBar hp={battle.opponentHP} /><p className="text-xs text-slate-500 mt-1">{battle.opponentHP} HP</p>
            </div>
          </div>
          {battle.challenge && <div className="glass-card p-4 text-sm"><span className="text-xs text-slate-400 uppercase tracking-wider">Challenge: </span><span className="text-white font-semibold">{battle.challenge.title}</span><span className={`ml-3 badge-${battle.challenge.difficulty}`}>{battle.challenge.difficulty}</span><p className="text-slate-400 mt-2 text-xs">{battle.challenge.description}</p></div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-900/30 bg-dark-800/50"><div className="w-2 h-2 rounded-full bg-green-500"/><span className="text-xs text-slate-400 flex-1">Your solution</span>{battle.status==='active'&&<button onClick={handleSubmit} className="btn-primary text-xs px-3 py-1">Submit</button>}</div>
              <Editor height="280px" language="javascript" value={code} onChange={v=>setCode(v||'')} theme="vs-dark" options={{ fontSize:13, minimap:{enabled:false} }} />
            </div>
            <div className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-900/30 bg-dark-800/50"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-xs text-slate-400">Opponent (live)</span></div>
              <Editor height="280px" language="javascript" value={battle.opponentCode} theme="vs-dark" options={{ fontSize:13, minimap:{enabled:false}, readOnly:true }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BattlePage;
