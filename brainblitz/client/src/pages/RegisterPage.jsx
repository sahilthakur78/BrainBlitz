import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { register, clearError } from '../store/slices/authSlice.js';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password needs at least 6 characters');
    const r = await dispatch(register(form));
    if (!r.error) { toast.success('Account created! Welcome to BrainBlitz! 🧠'); navigate('/dashboard'); }
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-grid flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,#4cc9f0,transparent)', filter: 'blur(70px)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-9 w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center font-bold text-lg font-display text-white"
            style={{ background: 'linear-gradient(135deg,#9d4edd,#4361ee)', boxShadow: '0 0 28px #9d4edd66' }}>BB</div>
          <h1 className="text-2xl font-display font-bold text-white">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Free forever · No credit card needed</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wider">Username</label>
            <input className="input-field" type="text" placeholder="blitzmaster99"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required minLength={3} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wider">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wider">Password</label>
            <input className="input-field" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold mt-2">
            {loading ? 'Creating account...' : 'Start playing free →'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already a player?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
