export interface LeaderboardEntry {
  id: number;
  username: string;
  name: string;
  university: string;
  points: number;
  rank: number;
  teamValue: number;
  matchesPlayed: number;
  winRate: number;
  avatar: string;
  is_current_user: boolean;
}
