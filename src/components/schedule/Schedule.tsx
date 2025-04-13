import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Match } from "../../store/slice/MatchesSlice";
import {
  Card
} from "@mui/material";
import "./Schedule.css";

import Avatar from '@mui/material/Avatar';

export const Schedule = () => {
  const allMatches: Match[] = useSelector(
    (state: RootState) => state.matches.allMatches
  );
  return (
    <div>
      {allMatches.map((match) => (
        <Card className="match-card">
          <div className="team-container">
            <div>
              <div>
              <Avatar alt="CSK" src={match.team1+'.png'} />
              </div>
              <div>{match.team1}</div>
            </div>
            <div>
              {match.team1_runs} / {match.team1_wickets} (
              {match.team1_overs_string})
            </div>

            <div>
              {match.team2_runs} / {match.team2_wickets} (
              {match.team2_overs_string})
            </div>
            <div>
            <Avatar alt="CSK" src={match.team2+'.png'} />
              <div>{match.team2}</div>
            </div>
          </div>
          {match.winner === match.team1 && <div>{match.team1} won by {match.team1_runs-match.team2_runs} runs</div>}
          {match.winner === match.team2 && <div>{match.team2} won by {10-match.team2_wickets} wickets</div>}
        </Card>
      ))}
    </div>
  );
};
