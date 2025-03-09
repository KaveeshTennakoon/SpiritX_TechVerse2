export interface Player {
  id: number;
  name: string;
  university: string;
  role: string;
  image: string;
  price: number;
  stats: {
    battingAvg: number;
    strikeRate: number;
    matches: number;
    centuries?: number;
    fifties?: number;
    highestScore?: number;
    wickets?: number;
    economy?: number;
    bestBowling?: string;
  };
}
