import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Match } from "../../store/slice/MatchesSlice";
 


export const Schedule = () => {
  const allMatches: Match[] = useSelector(
    (state: RootState) => state.matches.allMatches
  );
  return (
    <div>
        {allMatches.map(match=>(
            <div>
                {match.team1} vs {match.team2}
            </div>
        ))}
    </div>
  );
};
