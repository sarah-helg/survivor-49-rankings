"use client"

import { useState, useEffect } from "react"
import { contestants, type GameState } from "@/lib/contestants"
import { loadGameState } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    setGameState(loadGameState())
  }, [])

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Survivor 49 Rankings</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Predict the elimination order and compete with your friends to see who knows the game best
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">{18 - gameState.eliminations.length}</h3>
              <p className="text-muted-foreground">Contestants Remaining</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">{gameState.userRankings.length}</h3>
              <p className="text-muted-foreground">Players Competing</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">Week {gameState.currentWeek}</h3>
              <p className="text-muted-foreground">Current Episode</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/rank">
            <Button size="lg" className="w-full sm:w-auto">
              Submit Your Rankings
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Leaderboard
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Admin Panel
            </Button>
          </Link>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4">Step 1</Badge>
                <h3 className="font-semibold mb-2">Submit Rankings</h3>
                <p className="text-sm text-muted-foreground">
                  Predict the elimination order from first out to winner
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4">Step 2</Badge>
                <h3 className="font-semibold mb-2">Watch & Wait</h3>
                <p className="text-sm text-muted-foreground">
                  Follow along as contestants get eliminated each week
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4">Step 3</Badge>
                <h3 className="font-semibold mb-2">Earn Points</h3>
                <p className="text-sm text-muted-foreground">
                  Get points for accurate predictions and final 3 picks
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4">Step 4</Badge>
                <h3 className="font-semibold mb-2">Win Glory</h3>
                <p className="text-sm text-muted-foreground">
                  Compete with friends to see who knows Survivor best
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
