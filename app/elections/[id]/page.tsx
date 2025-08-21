"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, ArrowLeft, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import WalletConnect from "@/components/wallet-connect"

export default function ElectionDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [election, setElection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [votingStatus, setVotingStatus] = useState<"idle" | "voting" | "success" | "error">("idle")

  useEffect(() => {
    // Simulate loading election data
    const loadElection = async () => {
      if (isConnected) {
        try {
          // This would be replaced with actual contract calls
          setTimeout(() => {
            setElection({
              id: params.id,
              title: "City Council Election 2023",
              description: "Vote for your local city council representative",
              endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              candidates: [
                { id: "1", name: "Jane Smith", party: "Progressive Party", votes: 145 },
                { id: "2", name: "John Doe", party: "Conservative Party", votes: 120 },
                { id: "3", name: "Alex Johnson", party: "Independent", votes: 78 },
              ],
              totalVotes: 343,
              hasVoted: false,
              transactions: [
                {
                  hash: "0x1234...5678",
                  voter: "0xabcd...ef01",
                  candidate: "Jane Smith",
                  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                },
                {
                  hash: "0x8765...4321",
                  voter: "0x2345...6789",
                  candidate: "John Doe",
                  timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                },
                {
                  hash: "0xfedc...ba98",
                  voter: "0x9876...5432",
                  candidate: "Jane Smith",
                  timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                },
              ],
            })
            setLoading(false)
          }, 1500)
        } catch (error) {
          console.error("Error loading election:", error)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadElection()
  }, [isConnected, params.id])

  const handleWalletConnection = (connected: boolean) => {
    setIsConnected(connected)
  }

  const handleVote = async () => {
    if (!selectedCandidate) return

    setVotingStatus("voting")

    try {
      // This would be replaced with actual contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update the UI to show the user has voted
      const candidate = election.candidates.find((c: any) => c.id === selectedCandidate)

      setElection({
        ...election,
        candidates: election.candidates.map((c: any) =>
          c.id === selectedCandidate ? { ...c, votes: c.votes + 1 } : c,
        ),
        totalVotes: election.totalVotes + 1,
        hasVoted: true,
        transactions: [
          {
            hash:
              "0x" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 10),
            voter: "Your Address",
            candidate: candidate.name,
            timestamp: new Date(),
          },
          ...election.transactions,
        ],
      })

      setVotingStatus("success")
    } catch (error) {
      console.error("Error voting:", error)
      setVotingStatus("error")
    }
  }

  if (!isConnected) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your Ethereum wallet to view election details</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnect onConnectionChange={handleWalletConnection} />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading election details...</p>
        </div>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="container py-10">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Election not found</AlertTitle>
          <AlertDescription>The election you are looking for does not exist or has been removed.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription>{election.description}</CardDescription>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date() > election.endTime
                    ? `Ended ${formatDistanceToNow(election.endTime, { addSuffix: true })}`
                    : `Ends in ${formatDistanceToNow(election.endTime)}`}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Results</h3>
                  {election.candidates.map((candidate: any) => (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.party}</p>
                        </div>
                        <Badge variant="outline">{candidate.votes} votes</Badge>
                      </div>
                      <Progress
                        value={election.totalVotes ? (candidate.votes / election.totalVotes) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>

                {!election.hasVoted && new Date() <= election.endTime && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Cast Your Vote</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {election.candidates.map((candidate: any) => (
                        <Button
                          key={candidate.id}
                          variant={selectedCandidate === candidate.id ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setSelectedCandidate(candidate.id)}
                        >
                          {candidate.name}
                        </Button>
                      ))}
                    </div>

                    {votingStatus === "success" && (
                      <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Vote Successful</AlertTitle>
                        <AlertDescription>Your vote has been recorded on the blockchain.</AlertDescription>
                      </Alert>
                    )}

                    {votingStatus === "error" && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>There was an error recording your vote. Please try again.</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleVote}
                      disabled={!selectedCandidate || votingStatus === "voting" || votingStatus === "success"}
                      className="w-full"
                    >
                      {votingStatus === "voting" ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        "Submit Vote"
                      )}
                    </Button>
                  </div>
                )}

                {election.hasVoted && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>You have voted</AlertTitle>
                    <AlertDescription>You have already cast your vote in this election.</AlertDescription>
                  </Alert>
                )}

                {new Date() > election.endTime && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Election ended</AlertTitle>
                    <AlertDescription>This election has ended and voting is no longer possible.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Visualization</CardTitle>
              <CardDescription>Visual representation of votes on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 border rounded-lg flex items-center justify-center bg-muted/30">
                <p className="text-muted-foreground">Interactive blockchain visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent voting transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {election.transactions.map((tx: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Tx Hash:</span>
                      <span className="text-muted-foreground">{tx.hash}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-medium">Voter:</span>
                      <span className="text-muted-foreground">{tx.voter}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-medium">Candidate:</span>
                      <span className="text-muted-foreground">{tx.candidate}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-medium">Time:</span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
