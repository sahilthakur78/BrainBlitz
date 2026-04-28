import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchWorlds      = createAsyncThunk('game/fetchWorlds',      async (_, { rejectWithValue }) => { try { return (await api.get('/worlds')).data.worlds; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const fetchChallenges  = createAsyncThunk('game/fetchChallenges',  async (p, { rejectWithValue }) => { try { return (await api.get('/challenges', { params: p })).data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const submitChallenge  = createAsyncThunk('game/submitChallenge',  async ({ id, code, language }, { rejectWithValue }) => { try { return (await api.post(`/challenges/${id}/submit`, { code, language })).data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const gameSlice = createSlice({
  name: 'game',
  initialState: { worlds: [], challenges: [], currentChallenge: null, submissionResult: null, loading: false, error: null, activeWorld: null },
  reducers: {
    setActiveWorld(s,a)      { s.activeWorld = a.payload; },
    setCurrentChallenge(s,a) { s.currentChallenge = a.payload; },
    clearSubmission(s)       { s.submissionResult = null; },
  },
  extraReducers: b => {
    b
      .addCase(fetchWorlds.fulfilled,     (s,a) => { s.worlds = a.payload; })
      .addCase(fetchChallenges.fulfilled, (s,a) => { s.challenges = a.payload.challenges; })
      .addCase(submitChallenge.pending,   s     => { s.loading = true; s.submissionResult = null; })
      .addCase(submitChallenge.fulfilled, (s,a) => { s.loading = false; s.submissionResult = a.payload; })
      .addCase(submitChallenge.rejected,  (s,a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setActiveWorld, setCurrentChallenge, clearSubmission } = gameSlice.actions;
export default gameSlice.reducer;
