import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { submitChallenge, clearSubmission } from '../store/slices/gameSlice.js';

const LANG_MAP = { javascript:'javascript', python:'python', cpp:'cpp', html:'html', dsa:'javascript' };
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

export default function ChallengePage() {
  const { id }       = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const { user }     = useSelector(s => s.auth);
  const { loading, submissionResult } = useSelector(s => s.game);

  const [challenge, setChallenge] = useState(null);
  const [code,      setCode]      = useState('');
  const [timeLeft,  setTimeLeft]  = useState(null);
  const [showResult,setShowResult]= useState(false);
  const timerRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    loadChallenge();
    dispatch(clearSubmission());
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => { 
    if (submissionResult) setShowResult(true); 
  }, [submissionResult]);

  const loadChallenge = async () => {
    try {
      const res = await api.get(`/challenges/${id}`);
      const c = res.data.challenge;
      setChallenge(c);
      const starter = c.starterCode?.[c.language] || `// Write your solution here\nfunction solution() {\n  \n}`;
      setCode(starter);
      
      if (c.timeLimit) {
        // Clear existing timer
        if (timerRef.current) clearInterval(timerRef.current);
        
        const endTime = Date.now() + c.timeLimit;
        endTimeRef.current = endTime;
        
        const updateTimer = () => {
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
          setTimeLeft(remaining);    
          if (remaining <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            toast.error('Time is up! ⏰');
          }
        };
        
        // Initial update
        updateTimer();
        
        // Start interval
        timerRef.current = setInterval(updateTimer, 1000);
      }
    } catch { 
      toast.error('Challenge not found'); 
      navigate('/worlds'); 
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) return toast.error('Write some code first!');
    dispatch(submitChallenge({ id, code, language: challenge.language }));
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!challenge) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading challenge...</p>
      </div>
    </div>
  );

  const solved = user?.solvedChallenges?.includes(challenge._id);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-purple-900/30 glass flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-sm transition-colors">← Back</button>
          <div className="w-px h-4 bg-slate-700" />
          <span className="text-sm font-semibold text-white">{challenge.title}</span>
          <span className={`badge-${challenge.difficulty}`}>{challenge.difficulty}</span>
          {challenge.isBoss && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-900/30 text-pink-400 border border-pink-800/50 font-semibold">BOSS</span>}
          {solved && <span className="text-xs text-green-400 flex items-center gap-1">✓ Solved</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-yellow-500 font-semibold">+{challenge.xpReward} XP</span>
          {timeLeft !== null && (
            <span className={`text-sm font-mono font-bold px-3 py-1.5 rounded-lg border ${timeLeft < 30 ? 'text-red-400 bg-red-900/20 border-red-800/50' : 'text-green-400 bg-green-900/20 border-green-800/50'}`}>
              ⏱ {fmt(timeLeft)}
            </span>
          )}
          <button onClick={handleSubmit} disabled={loading || (timeLeft === 0)} className="btn-primary text-sm px-5 py-2">
            {loading ? '⏳ Evaluating...' : 'Submit →'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: description */}
        <div className="w-80 flex-shrink-0 border-r border-purple-900/30 overflow-y-auto p-4 space-y-5 glass">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Examples</p>
            <div className="space-y-2">
              {challenge.testCases?.filter(t => !t.isHidden).slice(0,3).map((tc,i) => (
                <div key={i} className="p-3 rounded-lg border border-purple-900/30 bg-dark-800/60 font-mono text-xs">
                  <p className="text-slate-400">In: <span className="text-cyan-400">{tc.input}</span></p>
                  <p className="text-slate-400">Out: <span className="text-green-400">{tc.expectedOutput}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Manual hints */}
          {challenge.hints?.length > 0 && (
            <div className="border-t border-purple-900/30 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Hints</p>
              {challenge.hints.map((h,i) => (
                <details key={i} className="mb-2 cursor-pointer">
                  <summary className="text-xs text-purple-400 hover:text-purple-300 list-none flex items-center gap-1">
                    <span>▶</span> Hint {i+1} <span className="text-slate-600">({h.cost} SP)</span>
                  </summary>
                  <p className="text-xs text-slate-400 mt-2 pl-3 leading-relaxed">{h.text}</p>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-purple-900/30 bg-dark-800/60">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-xs text-slate-500 ml-2 font-mono">
              solution.{challenge.language==='python'?'py':challenge.language==='cpp'?'cpp':'js'}
            </span>
            <span className="ml-auto text-xs text-slate-600 capitalize">{challenge.language}</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={LANG_MAP[challenge.language]||'javascript'}
              value={code}
              onChange={v => setCode(v||'')}
              theme="vs-dark"
              options={{
                fontSize: 14, fontFamily: "'JetBrains Mono','Fira Code',monospace",
                minimap: { enabled: false }, scrollBeyondLastLine: false,
                lineNumbers: 'on', renderLineHighlight: 'all',
                padding: { top: 16, bottom: 16 }, cursorBlinking: 'smooth', smoothScrolling: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {showResult && submissionResult && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="absolute inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResult(false)}>
            <motion.div initial={{ scale:0.85,y:20 }} animate={{ scale:1,y:0 }} exit={{ scale:0.85,opacity:0 }}
              className="glass-card p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{submissionResult.result?.passed ? '🎉' : '❌'}</div>
                <h2 className="text-2xl font-display font-bold">
                  {submissionResult.result?.passed
                    ? <span className="text-gradient">All Tests Passed!</span>
                    : <span className="text-red-400">Not quite right</span>}
                </h2>
                {submissionResult.xpEarned > 0 && <p className="text-yellow-400 font-bold mt-2 text-lg">+{submissionResult.xpEarned} XP earned!</p>}
                {submissionResult.newBadges?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-purple-400 text-sm">New badges!</p>
                    <div className="flex justify-center gap-2 mt-1">
                      {submissionResult.newBadges.map(b => <span key={b.id} title={b.name} className="text-2xl">{b.icon}</span>)}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2 mb-6">
                {submissionResult.result?.results?.map((r,i) => (
                  <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg text-xs border ${r.passed?'bg-green-900/20 border-green-800/30':'bg-red-900/20 border-red-800/30'}`}>
                    <span>{r.passed?'✅':'❌'}</span>
                    <span className="text-slate-300">Test {i+1}</span>
                    {!r.passed && r.actual && <span className="text-slate-500 ml-auto">Got: {String(r.actual).slice(0,30)}</span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowResult(false)} className="btn-ghost flex-1 py-2.5 text-sm">
                  {submissionResult.result?.passed ? 'Keep going' : 'Try again'}
                </button>
                {submissionResult.result?.passed && (
                  <button onClick={() => navigate('/worlds')} className="btn-primary flex-1 py-2.5 text-sm">Next →</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}