import { Match, updateMatch } from "../../store/slice/MatchesSlice";

import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./MatchCard.css";
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { TeamData } from "../../store/slice/TeamSlice";
interface MatchCardProps {
  match: Match;
}

interface MatchFormData {
  team1_runs: number;
  team1_wickets: number;
  team1_overs: string;
  team2_runs: number;
  team2_wickets: number;
  team2_overs: string;
  super_over_winner: string;
}

export const MatchCard = forwardRef<HTMLDivElement,MatchCardProps>(({ match },ref) => {
  const [editMatch, setEditMatch] = useState(false);
  const [superOver, setSuperOver] = useState(false);
  const [team1Position,setTeam1Position] = useState(0);
  const [team2Position,setTeam2Position] = useState(0);
  const teamsData: TeamData[] = useSelector(
    (state: RootState) => state.teams.teamsData
  );
  const dispatch = useDispatch<AppDispatch>();
  const [errorMap, setErrorMap] = useState<Map<string, string>>(new Map());
  const [matchForm, setMatchForm] = useState<MatchFormData>({
    team1_runs: 0,
    team1_overs: '0',
    team1_wickets: 0,
    team2_runs: 0,
    team2_overs: '0',
    team2_wickets: 0,
    super_over_winner: match.team1
  });
  const onFormChange = (e: any, field: any) => {
    setMatchForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    console.log({ FieldChanged: e.target.value, Field: matchForm });
  };

  useEffect(()=>{
        if(!match.editable && match.team1_runs == match.team2_runs) {
            matchForm.super_over_winner = match.winner;
            setSuperOver(true);
        }
  },[])

  const checkErrors = (value: number | string, field: string) => {
    if (field.includes("runs")) {
      value = Number(value);
      const team1_runs = matchForm.team1_runs;
      const team2_runs = matchForm.team2_runs;
      if(team1_runs === team2_runs && value!=0 && !superOver) {
        setSuperOver(true);
      } else if (team1_runs != team2_runs && superOver) {
        setSuperOver(false);
        setMatchForm((prev) => ({
            ...prev,
            ['super_over_winner']: ''
          }));
      }
      if (value < 0 || value > 720) {
        setErrorMap((prev) => {
          const newMap = new Map(prev);
          // Update the value
          newMap.set(field, "Enter correct value for runs");
          return newMap;
        });
      } else {
        setErrorMap((prev) => {
          const newMap = new Map(prev);
          // Update the value
          newMap.delete(field);
          return newMap;
        });
      }
    }
    if (field.includes("wickets")) {
      value = Number(value);
      if (value < 0 || value > 10) {
        setErrorMap((prev) => {
          const newMap = new Map(prev);
          // Update the value
          newMap.set(field, "Enter correct value for wickets");
          return newMap;
        });
      } else {
        setErrorMap((prev) => {
          const newMap = new Map(prev);
          // Update the value
          newMap.delete(field);
          return newMap;
        });
      }
    }
    if (field.includes("overs")) {
      value = String(value);
      const overs = getCricketOvers(value, "0");
      if (overs <= 0 || overs > 20) {
        setErrorMap((prev) => {
          const newMap = new Map(prev);
          // Update the value
          newMap.set(field, "Enter correct value for overs");
          return newMap;
        });
      } else {
        setErrorMap((prev) => {
          const newMap = new Map(prev);
          // Update the value
          newMap.delete(field);
          return newMap;
        });
      }
    }
    if(field.includes("super")) {
        if(value=='' && superOver) {
            setErrorMap((prev) => {
                const newMap = new Map(prev);
                // Update the value
                newMap.set(field, "Enter correct value for Super Over Winner");
                return newMap;
              });
        } else {
            setErrorMap((prev) => {
                const newMap = new Map(prev);
                // Update the value
                newMap.delete(field);
                return newMap;
              });
        }
    }
  };
  useEffect(() => {
    checkErrors(matchForm.team1_runs,"team1_runs");
    checkErrors(matchForm.team2_runs,"team2_runs");
    checkErrors(matchForm.team1_overs,"team1_overs");
    checkErrors(matchForm.team2_overs,"team2_overs");
    checkErrors(matchForm.team1_wickets,"team1_wickets");
    checkErrors(matchForm.team2_wickets,"team2_wickets");
    checkErrors(matchForm.team2_wickets,"super_over_winner");
  }, [matchForm]);

  useEffect(()=>{
    const team1 = teamsData.find(t=>t.teamName === match.team1);
    team1 && setTeam1Position(team1.position);
    const team2 = teamsData.find(t=>t.teamName === match.team2);
    team2 && setTeam2Position(team2.position);
  },[teamsData])

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

  const onEditMatch = () => {
    let winner = Number(matchForm.team1_runs) > Number(matchForm.team2_runs) ? match.team1 : match.team2;
    if(Number(matchForm.team1_runs) === Number(matchForm.team2_runs) ) {
       winner = matchForm.super_over_winner;
    }
    
    console.log({Winner: winner});
    const newMatch:Match = {
        ...match,
        team1_runs: Number(matchForm.team1_runs),
        team1_wickets: Number(matchForm.team1_wickets),
        team1_overs_string: matchForm.team1_overs,
        team1_overs: getCricketOvers(matchForm.team1_overs,String(matchForm.team1_wickets)),
        team2_runs: Number(matchForm.team2_runs),
        team2_overs_string: matchForm.team2_overs,
        team2_overs: getCricketOvers(matchForm.team2_overs,String(matchForm.team2_wickets)),
        team2_wickets: Number(matchForm.team2_wickets),
        winner:  winner
    };
    console.log({MatchData:newMatch});
    dispatch(updateMatch(newMatch));
    setEditMatch(false);
  }


  const onSwapTeams = () => {
    const newMatch:Match = {
        ...match,
       team1: match.team2,
       team2: match.team1,
       winner: ''
    };
    dispatch(updateMatch(newMatch));
  }

  return (
    <Card className="match-card" ref={ref}>
      <div className="team-container">
        <div className="team-summary">
          <div>
            <Avatar alt={match.team1} src={match.team1 + ".png"} />
          </div>
          <div>{match.team1}</div>
          {team1Position && <div># {team1Position}</div>}
        </div>
        {(!match.editable || match.team1_overs != 0) && !editMatch && (
          <div>
            {match.team1_runs} / {match.team1_wickets} (
            {match.team1_overs_string})
          </div>
        )}
        {!editMatch && match.editable && match.team1_overs == 0 && <div>0/0 (0.0)</div>}
        {editMatch && match.editable  && (
          <div className="match-form">
            <input
              type="number"
              name="team1_runs"
              placeholder="Runs"
              max={400}
              min={0}
              value={matchForm.team1_runs!=0 ? matchForm.team1_runs : ''}
              onChange={() => {
                onFormChange(event, "team1_runs");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="field1"
              placeholder="Wickets"
              max={10}
              min={0}
              value={matchForm.team1_runs!=0 ? matchForm.team1_wickets : ''}
              onChange={() => {
                onFormChange(event, "team1_wickets");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div>
              <input
                type="string"
                name="field1"
                placeholder="Overs"
                value={matchForm.team1_runs!=0 ? matchForm.team1_overs : ''}
                max={0}
                min={20}
                onChange={() => {
                  onFormChange(event, "team1_overs");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
        {editMatch && <SwapHorizIcon onClick={()=>{onSwapTeams()}}/>}
        {(!match.editable || match.team1_overs != 0) && !editMatch && (
          <div>
            {match.team2_runs} / {match.team2_wickets} (
            {match.team2_overs_string})
          </div>
        )}
        {!editMatch && match.editable && match.team1_overs == 0 && match.editable && <div>0/0 (0.0)</div>}
        {editMatch && match.editable && (
          <div className="match-form">
            <input
              type="number"
              name="team2_runs"
              placeholder="Runs"
              value={matchForm.team1_runs!=0 ? matchForm.team2_runs : ''}
              max={400}
              min={0}
              onChange={() => {
                onFormChange(event, "team2_runs");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="team2_wickets"
              placeholder="Wickets"
              value={matchForm.team1_runs!=0 ? matchForm.team2_wickets: ''}
              max={10}
              min={0}
              onChange={() => {
                onFormChange(event, "team2_wickets");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="team2_overs"
              placeholder="Overs"
              value={matchForm.team1_runs!=0 ? matchForm.team2_overs : ''}
              max={0}
              min={20}
              onChange={() => {
                onFormChange(event, "team2_overs");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            
          </div>
        )}
        <div className="team-summary">
          <Avatar alt={match.team2} src={match.team2 + ".png"} />
          <div>{match.team2}</div>
          {team2Position && <div># {team2Position}</div>}
        </div>
      </div>
      <div className="match-summary">
      {editMatch && superOver &&
                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Super Over Winner</InputLabel>
                  <Select
                    name="super_over_winner"
                    value={matchForm.super_over_winner}
                    label="Super Over Winner"
                    defaultValue={match.team1}
                    onChange={(event) => {
                        console.log({Value:event});
                        onFormChange(event, "super_over_winner");
                      }}
                  >
                    <MenuItem value={match.team1}>{match.team1}</MenuItem>
                    <MenuItem value={match.team2}>{match.team2}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            }
        <div className="match-details">
          {"T20 " + Number(match.id + 1) + " of 74"}{" "}
        </div>
        {(!match.editable || match.team1_overs!=0) && !superOver && match.winner === match.team1 && (
          <div>
            {match.team1} won by {match.team1_runs - match.team2_runs} runs
          </div>
        )}
        {(!match.editable || match.team1_overs!=0) && !superOver && match.winner === match.team2 && (
          <div>
            {match.team2} won by {10 - match.team2_wickets} wickets
          </div>
        )}
        {(!match.editable || match.team1_overs!=0) && superOver && (
          <div>
            {matchForm.super_over_winner} won in Super Over
          </div>
        )}
        {match.editable && !editMatch && (
          <div className="edit-match">
            <EditIcon
              onClick={() => {
                setEditMatch((prev) => !prev);
              }}
            />
          </div>
        )}
        {match.editable && editMatch && (
          <div className="edit-match">
           <Button variant="outlined" disabled={errorMap.size > 0} onClick={()=>{onEditMatch()}}>Save</Button>
          </div>
        )}
      </div>
    </Card>
  );
});
