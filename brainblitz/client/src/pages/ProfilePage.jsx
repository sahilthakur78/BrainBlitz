import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const wr = user?.battleStats?.totalBattles
    ? Math.round((user.battleStats.wins / user.battleStats.totalBattles) * 100) : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}>
        <h1 className="text-3xl font-display font-bold text-white">Profile 👤</h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} className="glass-card p-7 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold font-display text-white"
            style={{ background:'linear-gradient(135deg,#9d4edd,#4361ee)', boxShadow:'0 0 32px #9d4edd66' }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-xl font-display font-bold text-white">{user?.username}</h2>
          <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800/50">Level {user?.level}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800/50">{(user?.xp||0).toLocaleString()} XP</span>
          </div>
          <p className="text-slate-400 text-sm mt-5 leading-relaxed">{user?.bio || 'No bio yet.'}</p>
        </motion.div>

        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label:'Solved',     val:user?.solvedChallenges?.length||0, icon:'✅', color:'#06d6a0' },
              { label:'Streak',     val:`${user?.streak||0}d`,             icon:'🔥', color:'#f59e0b' },
              { label:'Wins',       val:user?.battleStats?.wins||0,        icon:'⚔️', color:'#f72585' },
              { label:'Win rate',   val:`${wr}%`,                          icon:'🎯', color:'#4cc9f0' },
              { label:'Skill pts',  val:user?.skillPoints||0,              icon:'💎', color:'#8b5cf6' },
              { label:'Badges',     val:user?.badges?.length||0,           icon:'🏅', color:'#ffd60a' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <span className="text-xl">{s.icon}</span>
                <span className="text-2xl font-bold font-display" style={{ color:s.color }}>{s.val}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Skill Mastery</h3>
            <div className="space-y-3">
              {[{key:'javascript',label:'JavaScript',color:'#F59E0B'},{key:'python',label:'Python',color:'#3B82F6'},{key:'cpp',label:'C++',color:'#EF4444'},{key:'htmlcss',label:'HTML/CSS',color:'#10B981'},{key:'dsa',label:'Data Structures',color:'#8B5CF6'}].map(sk => {
                const val = user?.skills?.[sk.key]||0;
                return (
                  <div key={sk.key}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{sk.label}</span><span style={{ color:sk.color }}>{val}%</span></div>
                    <div className="xp-bar-bg h-2"><motion.div className="h-2 rounded-full" initial={{ width:0 }} animate={{ width:`${val}%` }} transition={{ duration:0.8 }} style={{ background:sk.color }}/></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Badges Earned</h3>
            {user?.badges?.length ? (
              <div className="flex flex-wrap gap-3">
                {user.badges.map(b => (
                  <div key={b.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-800/40 bg-yellow-900/10">
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-xs text-yellow-400 font-medium">{b.name}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">Complete challenges to earn badges!</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
