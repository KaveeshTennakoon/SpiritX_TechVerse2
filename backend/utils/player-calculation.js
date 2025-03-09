// Calculate player points based on the given formula
const calculatePlayerPoints = (player) => {
    // Calculate batting strike rate = (Total Runs / Total Balls Faced) * 100
    const battingStrikeRate = player.balls_faced > 0 
      ? (player.total_runs / player.balls_faced) * 100 
      : 0;
    
    // Calculate batting average = Total Runs / Innings Played
    const battingAverage = player.innings_played > 0 
      ? player.total_runs / player.innings_played 
      : 0;
    
    // Calculate bowling strike rate = Total Balls Bowled / Total Wickets Taken
    // Convert overs to balls (1 over = 6 balls)
    const totalBallsBowled = Math.floor(player.overs_bowled) * 6 + ((player.overs_bowled % 1) * 10);
    const bowlingStrikeRate = player.wickets > 0 && totalBallsBowled > 0
      ? totalBallsBowled / player.wickets 
      : 0;
    
    // Calculate economy rate = (Total Runs Conceded / Total Balls Bowled) * 6
    const economyRate = totalBallsBowled > 0 
      ? (player.runs_conceded / totalBallsBowled) * 6 
      : 0;
    
    // Apply the formula from the handbook
    let points = (battingStrikeRate / 5 + battingAverage * 0.8);
    
    // Add bowling component if player has bowled
    if (bowlingStrikeRate > 0) {
      points += (500 / bowlingStrikeRate);
    }
    
    // Add economy component if player has economy rate
    if (economyRate > 0) {
      points += (140 / economyRate);
    }
    
    // Round to 2 decimal places
    return Math.round(points * 100) / 100;
  };
  
  // Calculate player value based on points
  const calculatePlayerValue = (points) => {
    // Formula: Value in Rupees = (9 × Points + 100) × 1000
    let value = (9 * points + 100) * 1000;
    
    // Round to the nearest 50,000
    return Math.round(value / 50000) * 50000;
  };
  
  module.exports = {
    calculatePlayerPoints,
    calculatePlayerValue
  };