import type { GameState, UserRanking } from "./contestants"

const STORAGE_KEY = "survivor-rankings-game"

export function saveGameState(gameState: GameState): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
  }
}

export function loadGameState(): GameState {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      parsed.userRankings = parsed.userRankings.map((ranking: any) => ({
        ...ranking,
        submittedAt: new Date(ranking.submittedAt),
      }))
      return parsed
    }
  }

  return {
    eliminations: [],
    userRankings: [],
    currentWeek: 1,
  }
}

export function saveUserRanking(ranking: UserRanking): void {
  const gameState = loadGameState()

  // Remove existing ranking from same user
  gameState.userRankings = gameState.userRankings.filter((r) => r.userId !== ranking.userId)

  // Add new ranking
  gameState.userRankings.push(ranking)

  saveGameState(gameState)
}

export function addElimination(contestantId: number): void {
  const gameState = loadGameState()

  if (!gameState.eliminations.includes(contestantId)) {
    gameState.eliminations.push(contestantId)
    gameState.currentWeek += 1
    saveGameState(gameState)
  }
}

export function removeElimination(contestantId: number): void {
  const gameState = loadGameState()

  gameState.eliminations = gameState.eliminations.filter((id) => id !== contestantId)
  gameState.currentWeek = Math.max(1, gameState.currentWeek - 1)

  saveGameState(gameState)
}

export function resetGame(): void {
  const resetState: GameState = {
    eliminations: [],
    userRankings: [],
    currentWeek: 1,
  }

  saveGameState(resetState)
}
