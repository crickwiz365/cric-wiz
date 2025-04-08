// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './store/slice/MatchesSlice'
import teamsReducer from './store/slice/TeamSlice'
export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    teams: teamsReducer
    // Add other reducers here later
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;