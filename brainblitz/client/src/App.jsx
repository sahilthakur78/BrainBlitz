import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe } from './store/slices/authSlice.js';

import LandingPage    from './pages/LandingPage.jsx';
import LoginPage      from './pages/LoginPage.jsx';
import RegisterPage   from './pages/RegisterPage.jsx';
import Dashboard      from './pages/Dashboard.jsx';
import WorldsPage     from './pages/WorldsPage.jsx';
import ChallengePage  from './pages/ChallengePage.jsx';
import BattlePage     from './pages/BattlePage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import ProfilePage    from './pages/ProfilePage.jsx';
import SkillTreePage  from './pages/SkillTreePage.jsx';
import Layout         from './components/layout/Layout.jsx';
import LoadingScreen  from './components/shared/LoadingScreen.jsx';

const Guard = ({ auth, children }) => {
  const { token, initialized } = useSelector(s => s.auth);
  if (!initialized) return <LoadingScreen />;
  if (auth  && !token) return <Navigate to="/login"     replace />;
  if (!auth &&  token) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
    else       dispatch({ type: 'auth/fetchMe/rejected' });
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'rgba(19,19,39,0.97)', border: '1px solid rgba(157,78,221,0.35)', color: '#e2e8f0', backdropFilter: 'blur(12px)' },
        duration: 3500,
      }} />
      <Routes>
        <Route path="/"        element={<Guard auth={false}><LandingPage  /></Guard>} />
        <Route path="/login"   element={<Guard auth={false}><LoginPage    /></Guard>} />
        <Route path="/register"element={<Guard auth={false}><RegisterPage /></Guard>} />

        <Route path="/" element={<Guard auth={true}><Layout /></Guard>}>
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="worlds"      element={<WorldsPage />} />
          <Route path="challenge/:id" element={<ChallengePage />} />
          <Route path="battle"      element={<BattlePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile"     element={<ProfilePage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="skills"      element={<SkillTreePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
