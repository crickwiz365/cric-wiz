// features/matches/matchesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Match {
  id: number;
  team1: string;
  team2: string;
  team1_runs: number;
  team1_wickets: number;
  team1_overs: number;
  team2_runs: number;
  team2_wickets: number;
  team2_overs: number;
  winner: string;
  date: string;
  editable: boolean;
}

interface MatchesState {
  allMatches: Match[];
}

const initialState: MatchesState = {
  allMatches: []
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    // Basic synchronous reducers
    addMatch: (state, action: PayloadAction<Match>) => {
      state.allMatches.push(action.payload);
    },
    addAllMatches: (state,action: PayloadAction<Match[]>)=>{
        state.allMatches = action.payload;
    },
    updateMatch: (state, action: PayloadAction<Match>) => {
      const index = state.allMatches.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.allMatches[index] = action.payload;
      }
    }
  },
});

// Export actions
export const { 
  addMatch, 
  updateMatch,
  addAllMatches
} = matchesSlice.actions;

// Export the reducer
export default matchesSlice.reducer;