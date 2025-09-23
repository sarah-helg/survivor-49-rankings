"use client"

import { useState, useEffect } from "react"
import { contestants, type GameState } from "@/lib/contestants"
import { loadGameState } from "@/lib/storage"
import { getLeaderboard } from "@/lib/scoring"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Trophy, Medal, Award, Eye, Target } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)

  useEffect(() => {
    setGameState(loadGameState())
  }, [])

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading leaderboard...</div>
      </div>
    )
  }

  const leaderboard = getLeaderboard(gameState.userRankings, gameState.eliminations)
  const eliminatedContestants = gameState.eliminations.map((id) => contestants.find((c) => c.id === id)!)

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {position}
          </div>
        )
    }
  }

  const getScoreBreakdown = (userRanking: number[], eliminations: number[]) => {
    const breakdown = {
      exactMatches: 0,
      oneOff: 0,
      twoOff: 0,
      finalThreeBonus: 0,
      total: 0,
    }

    // Calculate elimination points
    eliminations.forEach((eliminatedContestantId, actualPosition) => {
      const userPredictedPosition = userRanking.indexOf(eliminatedContestantId)

      if (userPredictedPosition !== -1) {
        const positionDifference = Math.abs(userPredictedPosition - actualPosition)

        if (positionDifference === 0) {
          breakdown.exactMatches += 5
        } else if (positionDifference === 1) {
          breakdown.oneOff += 3
        } else if (positionDifference === 2) {
          breakdown.twoOff += 1
        }
      }
    })

    // Calculate final three bonus
    const remainingContestants = userRanking.slice(-(18 - eliminations.length))
    const finalThree = remainingContestants.slice(-3)

    finalThree.forEach((contestantId) => {
      if (!eliminations.includes(contestantId)) {
        breakdown.finalThreeBonus += 3
      }
    })

    breakdown.total = breakdown.exactMatches + breakdown.oneOff + breakdown.twoOff + breakdown.finalThreeBonus

    return breakdown
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">
              Current standings after {gameState.eliminations.length} eliminations
            </p>
          </div>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="eliminations">Elimination History</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            {leaderboard.length === 0 ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
                <CardContent className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Rankings Yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to submit your predictions!</p>
                  <Link href="/rank">
                    <Button>Submit Your Rankings</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((player, index) => {
                  const breakdown = getScoreBreakdown(player.rankings, gameState.eliminations)

                  return (
                    <Card
                      key={player.userId}
                      className={`border-0 shadow-lg bg-card/50 backdrop-blur transition-all hover:shadow-xl ${
                        index === 0 ? "ring-2 ring-primary/20 bg-primary/5" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getPositionIcon(index + 1)}
                            <div>
                              <h3 className="text-xl font-bold">{player.userName}</h3>
                              <p className="text-sm text-muted-foreground">
                                Submitted {player.submittedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{player.points}</div>
                              <div className="text-sm text-muted-foreground">points</div>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{player.userName}'s Score Breakdown</DialogTitle>
                                  <DialogDescription>Detailed scoring analysis</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">
                                  {/* Score Summary */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                          {breakdown.exactMatches}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Exact Matches</div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{breakdown.oneOff}</div>
                                        <div className="text-xs text-muted-foreground">1 Position Off</div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-orange-600">{breakdown.twoOff}</div>
                                        <div className="text-xs text-muted-foreground">2 Positions Off</div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                          {breakdown.finalThreeBonus}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Final 3 Bonus</div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Elimination Predictions vs Reality */}
                                  <div>
                                    <h4 className="font-semibold mb-3">Elimination Predictions</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                      {eliminatedContestants.map((contestant, elimIndex) => {
                                        const predictedPosition = player.rankings.indexOf(contestant.id)
                                        const actualPosition = elimIndex
                                        const difference = Math.abs(predictedPosition - actualPosition)

                                        let scoreColor = "text-muted-foreground"
                                        let points = 0

                                        if (difference === 0) {
                                          scoreColor = "text-green-600"
                                          points = 5
                                        } else if (difference === 1) {
                                          scoreColor = "text-blue-600"
                                          points = 3
                                        } else if (difference === 2) {
                                          scoreColor = "text-orange-600"
                                          points = 1
                                        }

                                        return (
                                          <div
                                            key={contestant.id}
                                            className="flex items-center justify-between p-2 rounded bg-muted/30"
                                          >
                                            <div className="flex items-center gap-3">
                                              <img
                                                src={contestant.image || "/placeholder.svg"}
                                                alt={contestant.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                              />
                                              <span className="font-medium">{contestant.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                              <span>Predicted: {predictedPosition + 1}</span>
                                              <span>Actual: {actualPosition + 1}</span>
                                              <Badge
                                                variant={points > 0 ? "default" : "secondary"}
                                                className={scoreColor}
                                              >
                                                {points} pts
                                              </Badge>
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        {/* Quick Score Breakdown */}
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {breakdown.exactMatches > 0 && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              {breakdown.exactMatches / 5} exact matches
                            </Badge>
                          )}
                          {breakdown.oneOff > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {breakdown.oneOff / 3} close calls
                            </Badge>
                          )}
                          {breakdown.finalThreeBonus > 0 && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              Final 3 bonus
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="eliminations" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Elimination History
                </CardTitle>
                <CardDescription>Week-by-week elimination results</CardDescription>
              </CardHeader>
              <CardContent>
                {eliminatedContestants.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No eliminations yet</p>
                ) : (
                  <div className="space-y-4">
                    {eliminatedContestants.map((contestant, index) => (
                      <div key={contestant.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                        <Badge variant="destructive">Week {index + 1}</Badge>
                        <img
                          src={contestant.image || "/placeholder.svg"}
                          alt={contestant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{contestant.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {contestant.age} • {contestant.occupation} • {contestant.hometown}
                          </p>
                        </div>
                        <Badge variant="outline">#{18 - index} eliminated</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
