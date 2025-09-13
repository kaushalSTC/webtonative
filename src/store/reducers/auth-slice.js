// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isOTPRequested: false,
  dateOTPRequested: null,
  OTPRequestedPhoneNumber: null,
  OTPRequestedCountryCode: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state) => {
      state.isLoggedIn = true;
    },
    setOTPRequested: (state, action) => {
      state.isOTPRequested = action.payload;
    },
    setOTPRequestedDate: (state, action) => {
      state.dateOTPRequested = action.payload;
    },
    setOTPRequestedPhoneNumber: (state, action) => {
      state.OTPRequestedPhoneNumber = action.payload;
    },
    setOTPRequestedCountryCode: (state, action) => {
      state.OTPRequestedCountryCode = action.payload;
    },
    resetOTPRequested: (state) => {
      state.isOTPRequested = false;
      state.dateOTPRequested = null;
      state.OTPRequestedPhoneNumber = null;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.isOTPRequested = false;
      state.dateOTPRequested = null;
      state.OTPRequestedPhoneNumber = null;
    },
  },
});

export const { setLogin, setLogout, setOTPRequested, setOTPRequestedDate, setOTPRequestedPhoneNumber, resetOTPRequested, setOTPRequestedCountryCode } = authSlice.actions;
export default authSlice.reducer;
