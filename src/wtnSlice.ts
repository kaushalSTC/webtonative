import { createSlice, configureStore } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WtnState {
  isMobileApp: boolean;
  platform: string;
}

const initialState: WtnState = {
  isMobileApp: false,
  platform: 'Browser',
};

const wtnSlice = createSlice({
  name: 'wtn',
  initialState,
  reducers: {
    setMobileConfig(state, action: PayloadAction<{ isMobileApp: boolean; platform: string }>) {
      state.isMobileApp = action.payload.isMobileApp;
      state.platform = action.payload.platform;
    },
  },
});

export const wtnStore = configureStore({
  reducer: {
    wtn: wtnSlice.reducer,
  },
});

export const { setMobileConfig } = wtnSlice.actions;


export default wtnSlice.reducer; 