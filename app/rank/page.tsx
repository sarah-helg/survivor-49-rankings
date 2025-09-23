"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { contestants, type GameState, type UserRanking } from "@/lib/contestants"
import { loadGameState, saveUserRanking } from "@/lib/storage"
import { DragDropRanking } from "@/components/drag-drop-ranking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function RankPage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [userName, setUserName] = useState("")
  const [rankings, setRankings] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const state = loadGameState()
    setGameState(state)

    // Initialize rankings with all contestants (active ones first, then eliminated)
    const activeContestants = contestants.filter((c) => !state.eliminations.includes(c.id)).map((c) => c.id)
    const eliminatedContestants = state.eliminations

    setRankings([...eliminatedContestants, ...activeContestants])
  }, [])

  const handleSubmit = async () => {
    if (!userName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!gameState) return

    setIsSubmitting(true)
    setError("")

    try {
      const userRanking: UserRanking = {
        userId: userName.toLowerCase().replace(/\s+/g, "-"),
        userName: userName.trim(),
        rankings,
        submittedAt: new Date(),
      }

      saveUserRanking(userRanking)
      router.push("/leaderboard")
    } catch (err) {
      setError("Failed to save rankings. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const existingRanking = gameState.userRankings.find((r) => r.userName.toLowerCase() === userName.toLowerCase())

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
            <h1 className="text-3xl font-bold">Submit Your Rankings</h1>
            <p className="text-muted-foreground">Predict the elimination order for Survivor 49</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ranking Interface */}
          <div className="lg:col-span-2">
            <DragDropRanking
              initialRankings={rankings}
              onRankingsChange={setRankings}
              eliminatedContestants={gameState.eliminations}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Player Information</CardTitle>
                <CardDescription>Enter your name to submit rankings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userName">Your Name</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>

                {existingRanking && (
                  <Alert>
                    <AlertDescription>
                      You already submitted rankings. Submitting again will update your previous entry.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleSubmit} disabled={isSubmitting || !userName.trim()} className="w-full" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Rankings"}
                </Button>
              </CardContent>
            </Card>

            {/* Scoring Info */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Scoring System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Exact position</span>
                  <Badge>5 points</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">1 position off</span>
                  <Badge variant="secondary">3 points</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">2 positions off</span>
                  <Badge variant="secondary">1 point</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Final 3 bonus</span>
                  <Badge variant="default">+3 points</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Game Status */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Game Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current Week</span>
                  <span className="font-semibold">{gameState.currentWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Eliminated</span>
                  <span className="font-semibold">{gameState.eliminations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remaining</span>
                  <span className="font-semibold">{18 - gameState.eliminations.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
