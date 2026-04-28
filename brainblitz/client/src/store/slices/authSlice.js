import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try   { const r = await api.post('/auth/register', data); localStorage.setItem('bb_token', r.data.token); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try   { const r = await api.post('/auth/login', data); localStorage.setItem('bb_token', r.data.token); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try   { const r = await api.get('/auth/me'); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const claimDailyReward = createAsyncThunk('auth/dailyReward', async (_, { rejectWithValue }) => {
  try   { const r = await api.post('/auth/daily-reward'); return r.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('bb_token'), loading: false, error: null, initialized: false },
  reducers: {
    logout(s)           { s.user = null; s.token = null; localStorage.removeItem('bb_token'); },
    clearError(s)       { s.error = null; },
    updateUser(s, a)    { s.user = { ...s.user, ...a.payload }; },
  },
  extraReducers: b => {
    b
      .addCase(register.pending,       s     => { s.loading = true;  s.error = null; })
      .addCase(register.fulfilled,     (s,a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.initialized = true; })
      .addCase(register.rejected,      (s,a) => { s.loading = false; s.error = a.payload; })
      .addCase(login.pending,          s     => { s.loading = true;  s.error = null; })
      .addCase(login.fulfilled,        (s,a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; s.initialized = true; })
      .addCase(login.rejected,         (s,a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMe.fulfilled,      (s,a) => { s.user = a.payload.user; s.initialized = true; })
      .addCase(fetchMe.rejected,       s     => { s.user = null; s.token = null; s.initialized = true; localStorage.removeItem('bb_token'); })
      .addCase(claimDailyReward.fulfilled, (s,a) => {
        if (s.user) { s.user.xp = (s.user.xp||0) + a.payload.xpEarned; s.user.streak = a.payload.streak; }
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
