export function calculatePoints(userRanking: number[], eliminations: number[]): number {
  let totalPoints = 0

  // Check each elimination
  eliminations.forEach((eliminatedContestantId, actualPosition) => {
    const userPredictedPosition = userRanking.indexOf(eliminatedContestantId)

    if (userPredictedPosition !== -1) {
      const positionDifference = Math.abs(userPredictedPosition - actualPosition)

      // Scoring system
      if (positionDifference === 0) {
        totalPoints += 5 // Exact match
      } else if (positionDifference === 1) {
        totalPoints += 3 // One position off
      } else if (positionDifference === 2) {
        totalPoints += 1 // Two positions off
      }
    }
  })

  // Bonus points for final 3 predictions
  const remainingContestants = userRanking.slice(-(18 - eliminations.length))
  const finalThree = remainingContestants.slice(-3)

  finalThree.forEach((contestantId) => {
    if (!eliminations.includes(contestantId)) {
      totalPoints += 3 // Bonus for correctly predicting final 3
    }
  })

  return totalPoints
}

export function getLeaderboard(userRankings: any[], eliminations: number[]) {
  return userRankings
    .map((ranking) => ({
      ...ranking,
      points: calculatePoints(ranking.rankings, eliminations),
    }))
    .sort((a, b) => b.points - a.points)
}
