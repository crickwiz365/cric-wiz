import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TeamData = {
    teamName: string;
    runsScored: number;
    oversTaken: number;
    runsConceded: number;
    oversBowled: number;
    played: number;
    won: number;
    lost: number;
    tie: number;
    battingRr?: number;
    bowlingRr?: number;
    nrr: number;
    points: number;
    position: number;
  };

  export interface TeamsState {
    teamsData:TeamData[];
  }

  const initialState:TeamsState = {
    teamsData: []
  }

  export const teamsSlice = createSlice({
    initialState: initialState,
    name: 'teams',
    reducers: {
        updateTeamsData: (state,action:PayloadAction<TeamData[]>)=>{
            state.teamsData = action.payload;
        }
    }
  });

  export const {updateTeamsData} = teamsSlice.actions;

  export default teamsSlice.reducer;