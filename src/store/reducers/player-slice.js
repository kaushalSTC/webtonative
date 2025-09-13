import { createSlice } from '@reduxjs/toolkit';

const defaultPlayer = {
  id: '',
  name: 'Picklebay Player',
  email: '',
  phone: '',
  countryCode:'',
  gender: '',
  isProfileVerified: false,
  isEmailVerified: false,
  isPhoneVerified: false,
  loginType: '',
  playerType: '',
  skillLevel: '',
  rating: 0,
  dob: null,
  profilePic: null,
  createdAt: '',
  updatedAt: '',
  firstTimeLogin: false,
  firstTimeLoginPlayerInfoPage: 1, // State for Login UI
};

const playerSlice = createSlice({
  name: 'player',
  initialState: defaultPlayer,
  reducers: {
    setPlayer: (state, action) => {
      state.firstTimeLogin = action.payload.firstTimeLogin ? action.payload.firstTimeLogin : state.firstTimeLogin;
      state.id = action.payload.player.id;
      state.name = action.payload.player.name;
      state.email = action.payload.player.email;
      state.phone = action.payload.player.phone;
      state.countryCode = action.payload.player.countryCode;
      state.isEmailVerified = action.payload.player.isEmailVerified;
      state.isPhoneVerified = action.payload.player.isPhoneVerified;
      state.playerType = action.payload.player.playerType;
      state.skillLevel = action.payload.player.skillLevel;
      state.rating = action.payload.player.rating;
      state.gender = action.payload.player.gender;
      state.dob = action.payload.player.dob;
      state.profilePic = action.payload.player.profilePic;
      state.createdAt = action.payload.player.createdAt;
      state.updatedAt = action.payload.player.updatedAt;
    },
    updatePlayer: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.countryCode = action.payload.countryCode;
      state.isEmailVerified = action.payload.isEmailVerified;
      state.isPhoneVerified = action.payload.isPhoneVerified;
      state.playerType = action.payload.playerType;
      state.skillLevel = action.payload.skillLevel;
      state.rating = action.payload.rating;
      state.gender = action.payload.gender;
      state.dob = action.payload.dob;
      state.profilePic = action.payload.profilePic;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    resetPlayer: () => defaultPlayer,
    setFirstTimeLogin: (state, action) => {
      state.firstTimeLogin = action.payload;
    },
    setFirstTimeLoginPlayerInfoPage: (state, action) => {
      state.firstTimeLoginPlayerInfoPage = action.payload;
    },
  },
});

export const { updatePlayer, resetPlayer, setFirstTimeLogin, setPlayer, setFirstTimeLoginPlayerInfoPage } = playerSlice.actions;
export default playerSlice.reducer;