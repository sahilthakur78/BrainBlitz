import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-2 border-purple-500 border-t-transparent rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold font-display text-white"
          style={{ textShadow: '0 0 10px #9d4edd' }}>BB</div>
      </div>
      <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
        className="text-slate-400 text-sm font-medium tracking-wide">
        Loading BrainBlitz...
      </motion.p>
    </div>
  );
}
