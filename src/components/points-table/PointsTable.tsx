import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Match } from "../../store/slice/MatchesSlice";
import { TeamData, updateTeamsData } from "../../store/slice/TeamSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

import Avatar from "@mui/material/Avatar";
import "./PointsTable.css";

interface PointsTableProps {
  isMobile: boolean;
}

export const PointsTable: React.FC<PointsTableProps> = ({ isMobile }) => {
  const allMatches: Match[] = useSelector(
    (state: RootState) => state.matches.allMatches
  );
  const dispatch = useDispatch<AppDispatch>();
  const teamsData: TeamData[] = useSelector(
    (state: RootState) => state.teams.teamsData
  );
  const [pointsTable, setPointsTable] = useState([]);
  let teamData: Map<string, TeamData> = new Map();
  useEffect(() => {
    if (teamsData.length == 0) {
      console.log("API Call");
      allMatches.forEach((matchData) => {
        if (matchData["team1_overs"] != 0) {
          const team1Data: TeamData = teamData?.get(matchData["team1"]) || {
            teamName: matchData["team1"],
            runsScored: 0,
            oversTaken: 0,
            runsConceded: 0,
            oversBowled: 0,
            played: 0,
            won: 0,
            lost: 0,
            tie: 0,
            nrr: 0,
            points: 0,
            position: 0
          };
          team1Data.runsScored += matchData["team1_runs"];
          team1Data.oversTaken += matchData.team1_overs;

          const team2Data: TeamData = teamData?.get(matchData["team2"]) || {
            teamName: matchData["team2"],
            runsScored: 0,
            oversTaken: 0,
            runsConceded: 0,
            oversBowled: 0,
            played: 0,
            won: 0,
            lost: 0,
            tie: 0,
            nrr: 0,
            points: 0,
            position: 0
          };
          team2Data.runsScored += Number(matchData["team2_runs"]);
          team2Data.oversTaken += matchData.team2_overs;

          team1Data.played += 1;
          team1Data.runsConceded += Number(matchData["team2_runs"]);
          team1Data.oversBowled += matchData.team2_overs;
          team2Data.played += 1;
          team2Data.runsConceded += Number(matchData["team1_runs"]);
          team2Data.oversBowled += matchData.team1_overs;
          if (matchData["winner"] === matchData["team1"]) {
            team1Data.points += 2;
            team1Data.won += 1;
            team2Data.lost += 1;
          } else {
            team2Data.points += 2;
            team2Data.won += 1;
            team1Data.lost += 1;
          }
          teamData.set(matchData["team1"], team1Data);
          teamData.set(matchData["team2"], team2Data);
        }
      });
    } else {
      allMatches.forEach((matchData) => {
        if (matchData["team1_overs"] != 0) {
          const team1Data: TeamData = teamData?.get(matchData["team1"]) || {
            teamName: matchData["team1"],
            runsScored: 0,
            oversTaken: 0,
            runsConceded: 0,
            oversBowled: 0,
            played: 0,
            won: 0,
            lost: 0,
            tie: 0,
            nrr: 0,
            points: 0,
            position: 0
          };
          team1Data.runsScored += matchData["team1_runs"];
          team1Data.oversTaken += matchData.team1_overs;

          const team2Data: TeamData = teamData?.get(matchData["team2"]) || {
            teamName: matchData["team2"],
            runsScored: 0,
            oversTaken: 0,
            runsConceded: 0,
            oversBowled: 0,
            played: 0,
            won: 0,
            lost: 0,
            tie: 0,
            nrr: 0,
            points: 0,
            position: 0
          };
          team2Data.runsScored += Number(matchData["team2_runs"]);
          team2Data.oversTaken += matchData.team2_overs;

          team1Data.played += 1;
          team1Data.runsConceded += Number(matchData["team2_runs"]);
          team1Data.oversBowled += matchData.team2_overs;
          team2Data.played += 1;
          team2Data.runsConceded += Number(matchData["team1_runs"]);
          team2Data.oversBowled += matchData.team1_overs;
          if (matchData["winner"] === matchData["team1"]) {
            team1Data.points += 2;
            team1Data.won += 1;
            team2Data.lost += 1;
          } else if (matchData["winner"] === matchData["team2"]) {
            team2Data.points += 2;
            team2Data.won += 1;
            team1Data.lost += 1;
          }
          teamData.set(matchData["team1"], team1Data);
          teamData.set(matchData["team2"], team2Data);
        }
      });
    }
    teamData.forEach((data) => {
      data.battingRr = data.runsScored / data.oversTaken;
      data.bowlingRr = data.runsConceded / data.oversBowled;
      data.nrr = data.battingRr - data.bowlingRr;
      data.nrr = parseFloat(data.nrr.toFixed(3));
    });
    const sortedTeams: any = Array.from(teamData.entries()).sort((a, b) => {
      // First sort by points (descending)
      if (b[1].points !== a[1].points) {
        return b[1].points - a[1].points;
      }
      // If points are equal, sort by NRR (descending)
      return b[1].nrr - a[1].nrr;
    });
    setPointsTable(sortedTeams);
  }, [allMatches]);

  useEffect(()=>{
    let teams:TeamData[] = [];
    pointsTable.forEach((team,index)=>{
        teams.push({
            teamName: team[1]["teamName"],
            position: index+1,
            nrr: team[1]["nrr"],
            lost: team[1]["lost"],
            oversBowled: team[1]["oversBowled"],
            oversTaken:team[1]["oversTaken"],
            played: team[1]["played"],
            points: team[1]["points"],
            runsConceded: team[1]["runsConceded"],
            runsScored: team[1]["runsScored"],
            tie: team[1]["tie"],
            won: team[1]["won"]
        })
    })
    dispatch(updateTeamsData(teams));
    
  },[pointsTable])
 
  return (
    <div className="container mx-auto p-4 bg-black">
      {!isMobile && (
        <h2 className="text-2xl font-bold mb-4 text-white">
          IPL 2025 Points Table
        </h2>
      )}
      {!isMobile && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Position</th>
              <th className="py-2 px-4 border">Team</th>
              <th className="py-2 px-4 border">Points</th>
              <th className="py-2 px-4 border">NRR</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((t, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border font-medium">
                  <div className="point-team-name">
                    <Avatar
                      alt={t[1]["teamName"]}
                      src={t[1]["teamName"] + ".png"}
                    />
                    <div className="point-table-team-name">
                      {t[1]["teamName"]}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 border">{t[1]["points"]}</td>
                <td className="py-2 px-4 border">{t[1]["nrr"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {
        isMobile && 
        <TableContainer component={Paper}>
      <Table>
       
        <TableBody>
          {pointsTable.map((row,index) => (
            <TableRow key={index}>
                <TableCell sx={{ width: '10%', textAlign: 'left' }}>{index+1}</TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'left' }}><div className="point-team-name">
                    <Avatar
                      alt={row[1]["teamName"]}
                      src={row[1]["teamName"] + ".png"}
                    />
                    <div className="point-table-team-name">
                      {row[1]["teamName"]}
                    </div>
                  </div></TableCell>
              <TableCell sx={{ width: '30%', textAlign: 'left' }}>{row[1]['points']}</TableCell>
              <TableCell sx={{ width: '40%', textAlign: 'left' }}>{row[1]['nrr']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      }
    </div>
  );
};
