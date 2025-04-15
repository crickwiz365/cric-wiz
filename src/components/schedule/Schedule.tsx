import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Match } from "../../store/slice/MatchesSlice";
import "./Schedule.css";
import { MatchCard } from "../match-card/MatchCard";
import { useEffect, useRef } from "react";

export const Schedule = () => {
  const allMatches: Match[] = useSelector(
    (state: RootState) => state.matches.allMatches
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    let index = 0;
    itemRefs.current = allMatches.map((_, i) => {
        if(index===0) {
            if(_.editable) {
                index=i;
            }
        }
        return itemRefs.current[i] ?? null
    });
    console.log({ActiveIndex:index})
    scrollToItem(index);
  }, [allMatches]);

  const scrollToItem = (index: number) => {
    console.log({Scrolling:index})
    itemRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  };
  return (
    <div>
      {allMatches.map((match) => (
       <MatchCard match={match}/>
      ))}
    </div>
  );
};
