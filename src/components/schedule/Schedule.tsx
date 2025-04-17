import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Match } from "../../store/slice/MatchesSlice";
import "./Schedule.css";
import { MatchCard } from "../match-card/MatchCard";
import { useEffect, useRef, useState } from "react";

export const Schedule = () => {
  const allMatches: Match[] = useSelector(
    (state: RootState) => state.matches.allMatches
  );
  let activeFlag = false;  
  const [activeIndex,setActiveIndex] = useState(0);
  useEffect(()=>{
    allMatches.forEach((match,index)=>{
        if(!activeFlag && match.editable) {
            setActiveIndex(index);
            activeFlag=true;
            return;
        }
    })
  },[allMatches]);
  const activeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  return (
    <div>
      {allMatches.map((match) => (
       <MatchCard match={match} key={match.id}
       ref={match.id === activeIndex ? activeCardRef : null}
       />
      ))}
    </div>
  );
};
