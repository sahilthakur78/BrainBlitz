import { createSlice } from '@reduxjs/toolkit';

const battleSlice = createSlice({
  name: 'battle',
  initialState: { status: 'idle', roomId: null, players: [], challenge: null, countdown: 5, myHP: 100, opponentHP: 100, winnerId: null, opponentCode: '' },
  reducers: {
    setSearching(s)       { s.status = 'searching'; },
    setBattleFound(s,a)   { s.status='countdown'; s.roomId=a.payload.roomId; s.players=a.payload.room.players; s.challenge=a.payload.challenge; s.myHP=100; s.opponentHP=100; },
    setCountdown(s,a)     { s.countdown = a.payload; },
    setBattleActive(s)    { s.status = 'active'; },
    updateHP(s,a)         { const p=a.payload.players; s.myHP=p[0]?.hp??s.myHP; s.opponentHP=p[1]?.hp??s.opponentHP; },
    setBattleOver(s,a)    { s.status='finished'; s.winnerId=a.payload.winnerId; },
    setOpponentCode(s,a)  { s.opponentCode = a.payload.code; },
    resetBattle(s)        { Object.assign(s,{ status:'idle', roomId:null, players:[], challenge:null, countdown:5, myHP:100, opponentHP:100, winnerId:null, opponentCode:'' }); },
  },
});

export const { setSearching, setBattleFound, setCountdown, setBattleActive, updateHP, setBattleOver, setOpponentCode, resetBattle } = battleSlice.actions;
export default battleSlice.reducer;
