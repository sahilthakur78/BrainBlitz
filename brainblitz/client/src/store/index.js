import { configureStore } from '@reduxjs/toolkit';
import authReducer   from './slices/authSlice.js';
import gameReducer   from './slices/gameSlice.js';
import battleReducer from './slices/battleSlice.js';

export const store = configureStore({
  reducer: { auth: authReducer, game: gameReducer, battle: battleReducer },
  middleware: g => g({ serializableCheck: false }),
});
