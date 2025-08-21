"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { ArrowLeft, AlertTriangle, Edit, Save, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import WalletConnect from "@/components/wallet-connect"
import { useElectionStore, shortenAddress } from "@/lib/store"
import { ElectionCharts } from "@/components/election-charts"

export default function ElectionDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [editedEndDate, setEditedEndDate] = useState<Date | undefined>(undefined)
  const [newVoterAddress, setNewVoterAddress] = useState("")
  const [addingVoter, setAddingVoter] = useState(false)

  // Get data and actions from the store
  const getElectionById = useElectionStore((state) => state.getElectionById)
  const updateElection = useElectionStore((state) => state.updateElection)
  const endElection = useElectionStore((state) => state.endElection)
  const getVotersForElection = useElectionStore((state) => state.getVotersForElection)
  const getTransactionsForElection = useElectionStore((state) => state.getTransactionsForElection)

  const election = getElectionById(params.id)
  const voters = getVotersForElection(params.id)
  const transactions = getTransactionsForElection(params.id)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)

      if (election) {
        setEditedTitle(election.title)
        setEditedDescription(election.description)
        setEditedEndDate(new Date(election.endTime))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [election, isConnected])

  const handleWalletConnection = (connected: boolean) => {
    setIsConnected(connected)
  }

  const saveElectionChanges = () => {
    if (!election) return

    updateElection(election.id, {
      title: editedTitle,
      description: editedDescription,
      endTime: editedEndDate || new Date(),
    })

    setIsEditing(false)
  }

  const addVoter = () => {
    if (!newVoterAddress) return

    setAddingVoter(true)

    // Simulate adding a voter
    setTimeout(() => {
      // In a real implementation, this would add the voter to the blockchain
      setNewVoterAddress("")
      setAddingVoter(false)
    }, 1000)
  }

  const handleEndElection = () => {
    if (!election) return
    endElection(election.id)
    router.push("/admin")
  }

  if (!isConnected) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Authentication</CardTitle>
            <CardDescription>Please connect your Ethereum wallet to manage this election</CardDescription>
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
      <Button variant="outline" onClick={() => router.push("/admin")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Election Management</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Status:</p>
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                election.status === "Active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : election.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {election.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {election.status === "Active" && (
            <Button variant="destructive" onClick={handleEndElection}>
              End Election
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="voters">Voters</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Election Details</CardTitle>
                  <CardDescription>Basic information about this election</CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <DatePicker date={editedEndDate} setDate={setEditedEndDate} />
                    </div>
                    <Button onClick={saveElectionChanges}>Save Changes</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Title</h3>
                      <p>{election.title}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p>{election.description}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">End Date</h3>
                      <p>{new Date(election.endTime).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date() > new Date(election.endTime)
                          ? `Ended ${formatDistanceToNow(new Date(election.endTime), { addSuffix: true })}`
                          : `Ends in ${formatDistanceToNow(new Date(election.endTime))}`}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Total Votes</h3>
                      <p>{election.totalVotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Results</CardTitle>
                <CardDescription>Live vote tallies for each candidate</CardDescription>
              </CardHeader>
              <CardContent>
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
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          {election.totalVotes > 0 ? (
            <ElectionCharts election={election} />
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No votes yet</AlertTitle>
              <AlertDescription>
                There are no votes in this election yet. Statistics will be available once voting begins.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="voters">
          <Card>
            <CardHeader>
              <CardTitle>Eligible Voters</CardTitle>
              <CardDescription>Manage voters who can participate in this election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter Ethereum address"
                    value={newVoterAddress}
                    onChange={(e) => setNewVoterAddress(e.target.value)}
                  />
                </div>
                <Button onClick={addVoter} disabled={!newVoterAddress || addingVoter}>
                  {addingVoter ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Voter"
                  )}
                </Button>
              </div>

              {voters.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No voters yet</AlertTitle>
                  <AlertDescription>
                    No one has voted in this election yet. Voter information will appear here once voting begins.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Voting Status</TableHead>
                      <TableHead>Voted For</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voters.map((voter, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{shortenAddress(voter.address)}</TableCell>
                        <TableCell>
                          {voter.hasVoted ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            >
                              Voted
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            >
                              Not Voted
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{voter.votedFor || "N/A"}</TableCell>
                        <TableCell>
                          {voter.timestamp
                            ? formatDistanceToNow(new Date(voter.timestamp), { addSuffix: true })
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All blockchain transactions for this election</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No transactions yet</AlertTitle>
                  <AlertDescription>
                    No transactions have been recorded for this election yet. Transaction history will appear here once
                    voting begins.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Voter</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{shortenAddress(tx.hash)}</TableCell>
                        <TableCell className="font-mono">{shortenAddress(tx.voter)}</TableCell>
                        <TableCell>{tx.candidate}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
