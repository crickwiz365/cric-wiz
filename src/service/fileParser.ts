import Papa from 'papaparse';
export interface MatchData {
    team1: string;
    team2: string;
    team1Runs: number;
    team1Overs: number;
    team1Wickets: number;
    team2Runs: number;
    team2Overs: number;
    team2Wickets: number;
  }
export const parseFile = async() => {
    try {
        const response = await fetch('../assets/IPL_20258.csv');
        console.log({Response:response})
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
        const csvText = await response.text();
        console.log({CSVText:csvText});
    
        return new Promise((resolve) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: (results:any) => {
              const parsedData: MatchData[] = results.data.map((row: any) => ({
                team1: row.team1,
                team2: row.team2,
                team1Runs: parseInt(row.team1_runs),
                team1Overs: row.team1_overs,
                team1Wickets: parseInt(row.team1_wickets),
                team2Runs: parseInt(row.team2_runs),
                team2Overs: row.team2_overs,
                team2Wickets: parseInt(row.team2_wickets),
              }));
              console.log({MatchData:parsedData})
              resolve(parsedData);
            },
          });
        });
      } catch (error) {
        console.error('Error parsing CSV:', error);
        return [];
      }
}