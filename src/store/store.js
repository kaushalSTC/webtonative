import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './reducers/auth-slice';
import locationReducer from './reducers/location-slice';
import playerReducer from './reducers/player-slice';
import tournamentRegisterationReducer from './reducers/tournament-registeration-slice';
import socialEventRegistrationReducer from './reducers/socialevent-registration-slice';
import drawerReducer from './reducers/drawerSlice';
import gameScoreReducer from './reducers/gameScore-slice';
import wtnReducer from "./reducers/wtn-slice"

const authReducerPersistConfig = { key: 'auth', storage };
const playerReducerPersistConfig = { key: 'player', storage };
const tournamentRegisterationReducerPersistConfig = { key: 'tournamentRegisteration', storage };
const locationReducerPersistConfig = { key: 'location', storage };
const socialEventRegistrationPersistConfig = { key: 'socialEventRegistration', storage };

const persistedaAuthReducer = persistReducer(authReducerPersistConfig, authReducer);
const persistedPlayerReducer = persistReducer(playerReducerPersistConfig, playerReducer);
const persistedTournamentRegisterationReducer = persistReducer(tournamentRegisterationReducerPersistConfig, tournamentRegisterationReducer);
const persistedLocationReducer = persistReducer(locationReducerPersistConfig, locationReducer);
const persistedSocialEventRegistrationReducer = persistReducer(socialEventRegistrationPersistConfig, socialEventRegistrationReducer);

export const store = configureStore({
  reducer: {
    location: persistedLocationReducer,
    auth: persistedaAuthReducer,
    player: persistedPlayerReducer,
    tournamentRegisteration: persistedTournamentRegisterationReducer,
    socialEventRegistration: persistedSocialEventRegistrationReducer, 
    drawer: drawerReducer,
    gameScore: gameScoreReducer,
    wtn: wtnReducer,
  },

  // Redux by default expects all state and actions to be "serializable" (convertible to plain JSON). This is enforced by the serializableCheck middleware.
  // However, redux-persist uses some special actions (PERSIST and REHYDRATE) that contain non-serializable data when it's saving and loading state from storage.

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({                                          // getDefaultMiddleware is a function provided by Redux Toolkit that returns the default middleware array
      serializableCheck: {                                          // serializableCheck is an option that configures the serialization checking middleware
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],   // tells Redux which action types should skip the serialization check
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);
