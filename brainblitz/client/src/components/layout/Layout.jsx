import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { logout } from '../../store/slices/authSlice.js';

const NAV = [
  { to: '/dashboard',   icon: '◈', label: 'Home'      },
  { to: '/worlds',      icon: '🌍', label: 'Worlds'    },
  { to: '/battle',      icon: '⚔️', label: 'Battle'    },
  { to: '/leaderboard', icon: '🏆', label: 'Ranks'     },
  { to: '/skills',      icon: '🌿', label: 'Skills'    },
  { to: '/profile',     icon: '👤', label: 'Profile'   },
];

const XP_T = [0,100,250,500,900,1400,2000,2700,3500,4400,5500];

export default function Layout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);

  const lvl   = user?.level || 1;
  const curr  = XP_T[Math.min(lvl - 1, XP_T.length - 1)] || 0;
  const next  = XP_T[Math.min(lvl,     XP_T.length - 1)] || curr + 500;
  const pct   = Math.min(100, Math.round((((user?.xp||0) - curr) / (next - curr)) * 100));

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <motion.aside initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="w-[72px] flex flex-col items-center py-5 gap-1.5 glass border-r border-purple-900/25 z-50 flex-shrink-0">

        {/* Logo */}
        <div className="mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display text-white"
            style={{ background: 'linear-gradient(135deg,#9d4edd,#4361ee)', boxShadow: '0 0 22px #9d4edd66' }}>BB</div>
        </div>

        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} title={item.label}
            className={({ isActive }) =>
              `w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 group relative
               ${isActive ? 'bg-purple-600/20 border border-purple-500/50 shadow-[0_0_14px_#9d4edd44]' : 'hover:bg-white/5 border border-transparent'}`
            }>
            {({ isActive }) => (<>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-purple-300' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.label}</span>
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-purple-400 rounded-r-full" />}
            </>)}
          </NavLink>
        ))}

        {/* Footer */}
        <div className="mt-auto flex flex-col items-center gap-2.5">
          <div className="w-10">
            <div className="xp-bar-bg h-1 w-full">
              <div className="xp-bar" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[9px] text-center text-slate-600 mt-0.5">Lv {lvl}</p>
          </div>
          <button onClick={() => { dispatch(logout()); navigate('/login'); }} title="Logout"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-900/20 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 overflow-y-auto bg-grid">
        <Outlet />
      </main>
    </div>
  );
}
