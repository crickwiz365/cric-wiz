import { useEffect, useState } from "react";
import "./App.css";
import CsvService from "./service/CsvReader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { addAllMatches, Match } from "../src/store/slice/MatchesSlice";
import { PointsTable } from "./components/points-table/PointsTable";
import { Schedule } from "./components/schedule/Schedule";

import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";


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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
  }, []);


  return (
    <div>
      {!isMobile && (
        <div className={isMobile ? "" : "match-screen"}>
          <div className={isMobile ? "schedule-mobile" : "schedule"}>
            <Schedule />
          </div>
          <div className={isMobile ? "points-mobile" : "points"}>
            <PointsTable isMobile={isMobile} />
          </div>
        </div>
      )}
      {isMobile &&
        <div>
          <div className="points-mobile">
          <Accordion >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography component="span">
                IPL 2025 Points Table {isMobile}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PointsTable isMobile={isMobile} />
            </AccordionDetails>
            <AccordionActions>
              <Button>Cancel</Button>
              <Button>Agree</Button>
            </AccordionActions>
          </Accordion>
          </div>
          <Schedule />
        </div>
      }
    </div>
  );
}

export default App;
