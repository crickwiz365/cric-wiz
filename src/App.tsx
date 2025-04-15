import { useEffect } from "react";
import "./App.css";
import CsvService from "./service/CsvReader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { addAllMatches, Match } from "../src/store/slice/MatchesSlice";
import { PointsTable } from "./components/points-table/PointsTable";
import { Schedule } from "./components/schedule/Schedule";
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
};

const getCricketOvers = (overs: string, wickets: string) => {
  if (Number(wickets) == 10) {
    return 20;
  }
  let balls = overs.split(".")[1] || 0;
  let over = Number(overs.split(".")[0] || 0);
  balls = Number(balls);
  if (balls > 0) {
    return Number(over) + balls / 6;
  } else {
    return Number(over);
  }
};
function App() {
  let matches: Match[] = [];
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    CsvService.readCsv()
      .then((data) => {
        data.forEach((matchData, index) => {
          matches.push({
            id: index,
            date: matchData["date"],
            team1: matchData["team1"],
            team2: matchData["team2"],
            team1_overs: getCricketOvers(
              matchData["team1_overs"],
              matchData["team1_wickets"]
            ),
            team1_overs_string: matchData["team1_overs"],
            team1_runs: Number(matchData["team1_runs"]),
            team1_wickets: Number(matchData["team1_wickets"]),
            team2_overs: getCricketOvers(
              matchData["team2_overs"],
              matchData["team2_wickets"]
            ),
            team2_overs_string: matchData["team2_overs"],
            team2_runs: Number(matchData["team2_runs"]),
            team2_wickets: Number(matchData["team2_wickets"]),
            editable: matchData["editable"] === "Y",
            winner: matchData["winner"],
          });
        });

        dispatch(addAllMatches(matches));
      })
      .catch((error) => console.error("Error reading CSV:", error));
  }, []);

  return (
    <div className="match-screen">
      <div className="schedule">
        <Schedule />
      </div>
      <div className="points">
        <PointsTable />
      </div>
    </div>
    
  );
}

export default App;
