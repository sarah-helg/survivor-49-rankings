"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { contestants, type Contestant } from "@/lib/contestants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical } from "lucide-react"

interface DragDropRankingProps {
  initialRankings: number[]
  onRankingsChange: (rankings: number[]) => void
  eliminatedContestants: number[]
}

export function DragDropRanking({ initialRankings, onRankingsChange, eliminatedContestants }: DragDropRankingProps) {
  const [rankings, setRankings] = useState<number[]>(initialRankings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setRankings(initialRankings)
  }, [initialRankings])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newRankings = Array.from(rankings)
    const [reorderedItem] = newRankings.splice(result.source.index, 1)
    newRankings.splice(result.destination.index, 0, reorderedItem)

    setRankings(newRankings)
    onRankingsChange(newRankings)
  }

  const getContestantById = (id: number): Contestant => {
    return contestants.find((c) => c.id === id)!
  }

  const getPositionLabel = (index: number, total: number) => {
    const position = total - index
    if (position === 1) return "Winner"
    if (position === 2) return "Runner-up"
    if (position === 3) return "3rd Place"
    return `${position}th Place`
  }

  if (!mounted) {
    return <div className="animate-pulse">Loading ranking interface...</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Drag to Rank Contestants</h2>
        <p className="text-muted-foreground">
          Drag contestants to predict elimination order. Top = First Eliminated, Bottom = Winner
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="rankings">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-3 p-4 rounded-lg border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver ? "border-primary bg-accent/50" : "border-border bg-card/30"
              }`}
            >
              {rankings.map((contestantId, index) => {
                const contestant = getContestantById(contestantId)
                const isEliminated = eliminatedContestants.includes(contestantId)

                return (
                  <Draggable
                    key={contestantId}
                    draggableId={contestantId.toString()}
                    index={index}
                    isDragDisabled={isEliminated}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-all duration-200 ${
                          snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : "shadow-sm hover:shadow-md"
                        } ${
                          isEliminated
                            ? "opacity-50 bg-muted cursor-not-allowed"
                            : "bg-card cursor-grab active:cursor-grabbing"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className={`${isEliminated ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="flex items-center gap-4 flex-1">
                              <img
                                src={contestant.image || "/placeholder.svg"}
                                alt={contestant.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />

                              <div className="flex-1">
                                <h3 className="font-semibold">{contestant.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {contestant.age} • {contestant.occupation}
                                </p>
                              </div>

                              <div className="text-right">
                                <Badge
                                  variant={
                                    index < 3 ? "destructive" : index >= rankings.length - 3 ? "default" : "secondary"
                                  }
                                  className="mb-1"
                                >
                                  {getPositionLabel(index, rankings.length)}
                                </Badge>
                                {isEliminated && (
                                  <Badge variant="outline" className="block text-xs">
                                    Already Eliminated
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive">Early Eliminations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Top positions (18th-13th place)</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mid-Game</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Middle positions (12th-4th place)</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Final 3</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Bottom positions (+3 bonus points)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
