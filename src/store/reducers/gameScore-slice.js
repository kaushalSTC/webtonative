// src/store/reducers/gameScore-slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameScores: {}, // key will be gameId
};

const gameScoreSlice = createSlice({
  name: 'gameScore',
  initialState,
  reducers: {
    setGameScores(state, action) {
      const { gameId, matches, targetApi } = action.payload;
      state.gameScores[gameId] = { matches, targetApi };
    },
    clearGameScores(state, action) {
      const { gameId } = action.payload;
      delete state.gameScores[gameId];
    },
  },
});

export const { setGameScores, clearGameScores } = gameScoreSlice.actions;
export default gameScoreSlice.reducer;
