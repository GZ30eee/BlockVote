"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Info, AlertTriangle } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"
import { formatDistanceToNow } from "date-fns"
import { useElectionStore } from "@/lib/store"
import { ElectionNotification } from "@/components/election-notification"

export default function Dashboard() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(true)
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null)
  const [votingError, setVotingError] = useState<string | null>(null)

  // Get data and actions from the store
  const activeElections = useElectionStore((state) => state.activeElections)
  const pastElections = useElectionStore((state) => state.pastElections)
  const votedElections = useElectionStore((state) => state.votedElections)
  const castVote = useElectionStore((state) => state.castVote)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isConnected])

  const handleWalletConnection = (connected: boolean, address = "") => {
    setIsConnected(connected)
    setWalletAddress(address)

    if (!connected) {
      setWalletAddress("")
    }
  }

  const handleVote = async (electionId: string, candidateId: string, candidateName: string) => {
    // Prevent double voting
    if (votedElections[electionId]) {
      setVotingError(`You have already voted in this election.`)
      setTimeout(() => setVotingError(null), 3000)
      return
    }

    setVotingInProgress(electionId)
    setVotingError(null)

    try {
      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Cast the vote in our store
      castVote(electionId, candidateId, walletAddress, candidateName)
    } catch (error) {
      console.error("Error voting:", error)
      setVotingError("Failed to submit your vote. Please try again.")
    } finally {
      setVotingInProgress(null)
    }
  }

  if (!isConnected) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your Ethereum wallet to access the voting dashboard</CardDescription>
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
          <p className="text-lg font-medium">Loading elections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-6">
      <ElectionNotification />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Voting Dashboard</h1>
          <p className="text-muted-foreground">View and participate in blockchain-based elections</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 md:gap-4">
          <WalletConnect onConnectionChange={handleWalletConnection} />
          <Button onClick={() => router.push("/")} className="w-full sm:w-auto">
            Home
          </Button>
        </div>
      </div>

      {votingError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{votingError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="past">Past Elections</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeElections.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No active elections</AlertTitle>
              <AlertDescription>There are currently no active elections available for voting.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {activeElections.map((election) => (
                <Card key={election.id} className="overflow-hidden">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">{election.title}</CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ends in {formatDistanceToNow(election.endTime)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="space-y-4">
                      {election.candidates.map((candidate) => (
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
                  </CardContent>
                  <CardFooter className="p-4 md:p-6 pt-0 md:pt-0">
                    {votedElections[election.id] ? (
                      <Button disabled className="w-full">
                        Already Voted
                      </Button>
                    ) : votingInProgress === election.id ? (
                      <Button disabled className="w-full">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Submitting Vote...
                      </Button>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 w-full">
                        {election.candidates.map((candidate) => (
                          <Button
                            key={candidate.id}
                            variant="outline"
                            onClick={() => handleVote(election.id, candidate.id, candidate.name)}
                            className="justify-between"
                          >
                            <span>Vote for {candidate.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {candidate.party}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastElections.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No past elections</AlertTitle>
              <AlertDescription>There are no completed elections in your history.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {pastElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">{election.title}</CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Ended {formatDistanceToNow(election.endTime, { addSuffix: true })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="space-y-4">
                      {election.candidates.map((candidate) => (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {candidate.name}
                                {candidate.winner && <Badge className="ml-2 bg-green-500">Winner</Badge>}
                              </p>
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
                  </CardContent>
                  <CardFooter className="p-4 md:p-6 pt-0 md:pt-0">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push(`/elections/${election.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
