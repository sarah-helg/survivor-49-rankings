"use client"

import { useState, useEffect } from "react"
import { contestants, type GameState } from "@/lib/contestants"
import { loadGameState } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    setGameState(loadGameState())
  }, [])

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const activeContestants = contestants.filter((c) => !gameState.eliminations.includes(c.id))
  const eliminatedContestants = gameState.eliminations.map((id) => contestants.find((c) => c.id === id)!)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Survivor 49 Rankings
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Predict the elimination order and compete with your friends to see who knows the game best
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">{activeContestants.length}</CardTitle>
              <CardDescription>Contestants Remaining</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">{gameState.userRankings.length}</CardTitle>
              <CardDescription>Players Competing</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">Week {gameState.currentWeek}</CardTitle>
              <CardDescription>Current Episode</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/rank">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg">
              Submit Your Rankings
            </Button>
          </Link>

          <Link href="/leaderboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg bg-transparent">
              View Leaderboard
            </Button>
          </Link>

          <Link href="/admin">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg">
              Admin Panel
            </Button>
          </Link>
        </div>

        {/* Eliminated Contestants */}
        {eliminatedContestants.length > 0 && (
          <Card className="mb-12 border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Eliminated Contestants</CardTitle>
              <CardDescription>In order of elimination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {eliminatedContestants.map((contestant, index) => (
                  <Badge key={contestant.id} variant="secondary" className="text-sm py-2 px-3">
                    {index + 1}. {contestant.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Contestants Grid */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">All Contestants</CardTitle>
            <CardDescription>Survivor 49 Cast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {contestants.map((contestant) => (
                <div
                  key={contestant.id}
                  className={`text-center p-4 rounded-lg border transition-all ${
                    gameState.eliminations.includes(contestant.id) ? "opacity-50 bg-muted" : "bg-card hover:shadow-md"
                  }`}
                >
                  <img
                    src={contestant.image || "/placeholder.svg"}
                    alt={contestant.name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                  />
                  <h3 className="font-semibold text-sm">{contestant.name}</h3>
                  <p className="text-xs text-muted-foreground">{contestant.age}</p>
                  {gameState.eliminations.includes(contestant.id) && (
                    <Badge variant="destructive" className="mt-1 text-xs">
                      Eliminated
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
