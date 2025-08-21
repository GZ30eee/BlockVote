"use client"

import { useState, useEffect } from "react"
import { useElectionStore, type Election } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ElectionNotification() {
  const [open, setOpen] = useState(false)
  const [endedElections, setEndedElections] = useState<Election[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const getRecentlyEndedElections = useElectionStore((state) => state.getRecentlyEndedElections)

  useEffect(() => {
    // Check for recently ended elections
    const elections = getRecentlyEndedElections()
    if (elections.length > 0) {
      setEndedElections(elections)
      setOpen(true)
    }
  }, [getRecentlyEndedElections])

  const handleNext = () => {
    if (currentIndex < endedElections.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setOpen(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (endedElections.length === 0) return null

  const currentElection = endedElections[currentIndex]
  const winner = currentElection.candidates.find((c) => c.winner)

  if (!winner) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Election Results
          </DialogTitle>
          <DialogDescription>The following election has ended and results are now available.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">{currentElection.title}</h3>
            <p className="text-sm text-muted-foreground">{currentElection.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Ended {formatDistanceToNow(currentElection.endTime, { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-bold">{winner.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{winner.party}</Badge>
                  <span className="text-sm">{winner.votes} votes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Other Candidates</h4>
            <div className="space-y-2">
              {currentElection.candidates
                .filter((c) => !c.winner)
                .sort((a, b) => b.votes - a.votes)
                .map((candidate) => (
                  <div key={candidate.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{candidate.name}</span>
                      <span className="text-muted-foreground ml-2">({candidate.party})</span>
                    </div>
                    <span>{candidate.votes} votes</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {endedElections.length > 1 && currentIndex < endedElections.length - 1 ? (
            <Button onClick={handleNext}>Next Result</Button>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
