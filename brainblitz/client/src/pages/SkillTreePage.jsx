import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { updateUser } from '../store/slices/authSlice.js';

const TREES = {
  javascript: { color:'#F59E0B', label:'JavaScript Track', nodes:[
    { id:'js-basics',    name:'Basics',     icon:'JS',  cost:0,   requires:[] },
    { id:'js-functions', name:'Functions',  icon:'fn',  cost:50,  requires:['js-basics'] },
    { id:'js-arrays',    name:'Arrays',     icon:'[]',  cost:80,  requires:['js-basics'] },
    { id:'js-objects',   name:'Objects',    icon:'{}',  cost:100, requires:['js-functions'] },
    { id:'js-async',     name:'Async',      icon:'⏳',  cost:150, requires:['js-objects'] },
    { id:'js-closures',  name:'Closures',   icon:'🔒',  cost:120, requires:['js-functions'] },
  ]},
  python: { color:'#3B82F6', label:'Python Track', nodes:[
    { id:'py-basics',      name:'Basics',     icon:'Py', cost:0,   requires:[] },
    { id:'py-lists',       name:'Lists',      icon:'[]', cost:50,  requires:['py-basics'] },
    { id:'py-dicts',       name:'Dicts',      icon:'{}', cost:80,  requires:['py-basics'] },
    { id:'py-oop',         name:'OOP',        icon:'🏗', cost:120, requires:['py-lists'] },
    { id:'py-generators',  name:'Generators', icon:'⚡', cost:160, requires:['py-oop'] },
  ]},
  dsa: { color:'#8B5CF6', label:'Data Structures Track', nodes:[
    { id:'dsa-arrays',  name:'Arrays',    icon:'[]',  cost:0,   requires:[] },
    { id:'dsa-stack',   name:'Stack',     icon:'📚',  cost:60,  requires:['dsa-arrays'] },
    { id:'dsa-queue',   name:'Queue',     icon:'↔️',  cost:60,  requires:['dsa-arrays'] },
    { id:'dsa-hashmap', name:'HashMap',   icon:'#',   cost:100, requires:['dsa-arrays'] },
    { id:'dsa-tree',    name:'Trees',     icon:'🌳',  cost:150, requires:['dsa-stack'] },
    { id:'dsa-graph',   name:'Graphs',    icon:'🕸',  cost:200, requires:['dsa-tree'] },
  ]},
};

export default function SkillTreePage() {
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);
  const unlocked  = user?.unlockedSkills || [];

  const canUnlock = node => {
    if (unlocked.includes(node.id)) return false;
    if (node.cost > (user?.skillPoints||0)) return false;
    return node.requires.every(r => unlocked.includes(r));
  };

  const unlock = async node => {
    try {
      const r = await api.post('/users/unlock-skill', { skillId:node.id, cost:node.cost });
      dispatch(updateUser({ skillPoints:r.data.skillPoints, unlockedSkills:r.data.unlockedSkills }));
      toast.success(`Unlocked: ${node.name}! 🎉`);
    } catch (e) { toast.error(e.response?.data?.message||'Failed'); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Skill Tree 🌿</h1>
          <p className="text-slate-500 text-sm mt-1">Spend skill points to unlock new abilities</p>
        </div>
        <div className="glass-card px-5 py-3 text-center">
          <p className="text-2xl font-bold text-purple-400">{user?.skillPoints||0}</p>
          <p className="text-xs text-slate-500">skill points</p>
        </div>
      </motion.div>

      {Object.entries(TREES).map(([key, tree], ti) => (
        <motion.div key={key} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:ti*0.1 }}
          className="glass-card p-6" style={{ borderColor:`${tree.color}28` }}>
          <h2 className="text-base font-display font-bold mb-5" style={{ color:tree.color }}>{tree.label}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {tree.nodes.map(node => {
              const isUnlocked  = unlocked.includes(node.id);
              const available   = canUnlock(node);
              const prereqsMet  = node.requires.every(r => unlocked.includes(r));
              const affordable  = node.cost <= (user?.skillPoints||0);
              return (
                <motion.button key={node.id}
                  whileHover={available?{ scale:1.06 }:{}}
                  whileTap={available?{ scale:0.96 }:{}}
                  onClick={() => available && unlock(node)}
                  disabled={!available}
                  className={`p-3 rounded-xl text-center border transition-all
                    ${isUnlocked?'border-green-500/40 bg-green-900/15':''}
                    ${available&&!isUnlocked?'cursor-pointer':'cursor-not-allowed opacity-50'}
                    ${!isUnlocked&&!available?'border-slate-800/60 bg-dark-800/30':''}`}
                  style={available&&!isUnlocked?{ borderColor:tree.color, background:`${tree.color}0e` }:{}}>
                  <div className="text-xl mb-1">{node.icon}</div>
                  <p className="text-[11px] font-semibold" style={{ color:isUnlocked?'#06d6a0':available?tree.color:'#475569' }}>{node.name}</p>
                  {!isUnlocked&&node.cost>0&&<p className={`text-[10px] mt-0.5 ${affordable&&prereqsMet?'text-yellow-400':'text-slate-600'}`}>{node.cost} SP</p>}
                  {isUnlocked&&<p className="text-[10px] text-green-400 mt-0.5">✓ Owned</p>}
                  {!prereqsMet&&!isUnlocked&&<p className="text-[10px] text-slate-600 mt-0.5">🔒</p>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
