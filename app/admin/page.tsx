"use client"

import { useState, useEffect } from "react"
import { contestants, type GameState } from "@/lib/contestants"
import { loadGameState, addElimination, saveGameState } from "@/lib/storage"
import { getLeaderboard } from "@/lib/scoring"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Trash2, RotateCcw, UserX, Trophy } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedContestant, setSelectedContestant] = useState<string>("")
  const [isEliminating, setIsEliminating] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  useEffect(() => {
    setGameState(loadGameState())
  }, [])

  const handleElimination = () => {
    if (!selectedContestant || !gameState) return

    setIsEliminating(true)

    try {
      addElimination(Number.parseInt(selectedContestant))
      setGameState(loadGameState())
      setSelectedContestant("")
    } catch (error) {
      console.error("Failed to eliminate contestant:", error)
    } finally {
      setIsEliminating(false)
    }
  }

  const handleResetGame = () => {
    const resetState: GameState = {
      eliminations: [],
      userRankings: [],
      currentWeek: 1,
    }

    saveGameState(resetState)
    setGameState(resetState)
    setShowResetDialog(false)
  }

  const removeElimination = (contestantId: number) => {
    if (!gameState) return

    const newEliminations = gameState.eliminations.filter((id) => id !== contestantId)
    const newGameState = {
      ...gameState,
      eliminations: newEliminations,
      currentWeek: Math.max(1, gameState.currentWeek - 1),
    }

    saveGameState(newGameState)
    setGameState(newGameState)
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading admin panel...</div>
      </div>
    )
  }

  const activeContestants = contestants.filter((c) => !gameState.eliminations.includes(c.id))
  const eliminatedContestants = gameState.eliminations.map((id) => contestants.find((c) => c.id === id)!)
  const leaderboard = getLeaderboard(gameState.userRankings, gameState.eliminations)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage eliminations and game state</p>
            </div>
          </div>

          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Game</DialogTitle>
                <DialogDescription>
                  This will clear all eliminations and user rankings. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetGame}>
                  Reset Game
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Elimination Interface */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5" />
                  Eliminate Contestant
                </CardTitle>
                <CardDescription>Select a contestant to eliminate from Week {gameState.currentWeek}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Select value={selectedContestant} onValueChange={setSelectedContestant}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select contestant to eliminate" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeContestants.map((contestant) => (
                        <SelectItem key={contestant.id} value={contestant.id.toString()}>
                          {contestant.name} - {contestant.occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleElimination}
                    disabled={!selectedContestant || isEliminating}
                    variant="destructive"
                  >
                    {isEliminating ? "Eliminating..." : "Eliminate"}
                  </Button>
                </div>

                {activeContestants.length === 0 && (
                  <Alert>
                    <Trophy className="h-4 w-4" />
                    <AlertDescription>All contestants have been eliminated! The game is complete.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Elimination History */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Elimination History</CardTitle>
                <CardDescription>Contestants eliminated in order (click to undo)</CardDescription>
              </CardHeader>
              <CardContent>
                {eliminatedContestants.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No eliminations yet</p>
                ) : (
                  <div className="space-y-3">
                    {eliminatedContestants.map((contestant, index) => (
                      <div
                        key={contestant.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="destructive">Week {index + 1}</Badge>
                          <img
                            src={contestant.image || "/placeholder.svg"}
                            alt={contestant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold">{contestant.name}</h4>
                            <p className="text-sm text-muted-foreground">{contestant.occupation}</p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeElimination(contestant.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Game Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current Week</span>
                  <Badge>{gameState.currentWeek}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Contestants Remaining</span>
                  <Badge variant="secondary">{activeContestants.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Eliminated</span>
                  <Badge variant="destructive">{eliminatedContestants.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Players Competing</span>
                  <Badge variant="outline">{gameState.userRankings.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current Leaderboard Preview */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Current Standings
                </CardTitle>
                <CardDescription>Top 5 players based on current eliminations</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No rankings submitted yet</p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 5).map((player, index) => (
                      <div key={player.userId} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                          <span className="font-medium">{player.userName}</span>
                        </div>
                        <Badge variant="outline">{player.points} pts</Badge>
                      </div>
                    ))}
                    {leaderboard.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{leaderboard.length - 5} more players
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Full Leaderboard
                  </Button>
                </Link>
                <Link href="/rank">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <UserX className="h-4 w-4 mr-2" />
                    Submit Rankings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
