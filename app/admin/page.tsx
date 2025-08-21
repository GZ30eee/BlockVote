"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2, Users, Calendar, CheckCircle } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"
import { useElectionStore, type Election } from "@/lib/store"

export default function AdminDashboard() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [candidates, setCandidates] = useState<{ name: string; party: string }[]>([{ name: "", party: "" }])
  const [electionTitle, setElectionTitle] = useState("")
  const [electionDescription, setElectionDescription] = useState("")
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [voterAddresses, setVoterAddresses] = useState("")
  const [creatingElection, setCreatingElection] = useState(false)
  const [electionCreated, setElectionCreated] = useState(false)

  // Get data and actions from the store
  const activeElections = useElectionStore((state) => state.activeElections)
  const pastElections = useElectionStore((state) => state.pastElections)
  const addElection = useElectionStore((state) => state.addElection)
  const endElection = useElectionStore((state) => state.endElection)
  const getVotersForElection = useElectionStore((state) => state.getVotersForElection)

  const handleWalletConnection = (connected: boolean, address = "") => {
    setIsConnected(connected)
    setWalletAddress(address)
  }

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", party: "" }])
  }

  const removeCandidate = (index: number) => {
    const newCandidates = [...candidates]
    newCandidates.splice(index, 1)
    setCandidates(newCandidates)
  }

  const updateCandidate = (index: number, field: "name" | "party", value: string) => {
    const newCandidates = [...candidates]
    newCandidates[index][field] = value
    setCandidates(newCandidates)
  }

  const createElection = () => {
    setCreatingElection(true)

    setTimeout(() => {
      // Create a new election
      const newElection: Election = {
        id: (activeElections.length + pastElections.length + 1).toString(),
        title: electionTitle,
        description: electionDescription,
        endTime: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
        candidates: candidates.map((candidate, index) => ({
          id: (index + 1).toString(),
          name: candidate.name,
          party: candidate.party,
          votes: 0,
        })),
        totalVotes: 0,
        status: "Active",
        transactions: [],
      }

      // Add the election to the store
      addElection(newElection)

      // Reset form
      setElectionTitle("")
      setElectionDescription("")
      setEndDate(undefined)
      setCandidates([{ name: "", party: "" }])
      setVoterAddresses("")
      setCreatingElection(false)
      setElectionCreated(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setElectionCreated(false)
      }, 3000)
    }, 1500)
  }

  const handleEndElection = (id: string) => {
    endElection(id)
  }

  if (!isConnected) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Authentication</CardTitle>
            <CardDescription>Please connect your Ethereum wallet to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnect onConnectionChange={handleWalletConnection} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Election Admin Dashboard</h1>
          <p className="text-muted-foreground">Create and manage blockchain-based elections</p>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnect onConnectionChange={handleWalletConnection} />
          <Button onClick={() => router.push("/")}>Home</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeElections.length + pastElections.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeElections.length} active, {pastElections.length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.values(useElectionStore.getState().voters).flat().length}</div>
            <p className="text-xs text-muted-foreground">Across all elections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...activeElections, ...pastElections].reduce((sum, election) => sum + election.totalVotes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all elections</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create">Create Election</TabsTrigger>
          <TabsTrigger value="manage">Manage Elections</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Election</CardTitle>
              <CardDescription>Set up a new blockchain-based election with custom candidates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {electionCreated && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Election created successfully! You can now manage it from the "Manage Elections" tab.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., City Council Election 2023"
                  value={electionTitle}
                  onChange={(e) => setElectionTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about this election"
                  value={electionDescription}
                  onChange={(e) => setElectionDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Candidates</Label>
                  <Button variant="outline" size="sm" onClick={addCandidate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </Button>
                </div>

                {candidates.map((candidate, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`candidate-name-${index}`}>Name</Label>
                      <Input
                        id={`candidate-name-${index}`}
                        placeholder="Candidate name"
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`candidate-party-${index}`}>Party/Affiliation</Label>
                      <Input
                        id={`candidate-party-${index}`}
                        placeholder="Party or affiliation"
                        value={candidate.party}
                        onChange={(e) => updateCandidate(index, "party", e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCandidate(index)}
                      disabled={candidates.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligible-voters">Eligible Voter Addresses</Label>
                <Textarea
                  id="eligible-voters"
                  placeholder="Enter Ethereum addresses separated by commas (leave empty for public election)"
                  value={voterAddresses}
                  onChange={(e) => setVoterAddresses(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Only these addresses will be able to participate in the election. Leave empty to allow any registered
                  voter.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={createElection}
                disabled={!electionTitle || !endDate || candidates.some((c) => !c.name) || creatingElection}
              >
                {creatingElection ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Creating Election...
                  </>
                ) : (
                  "Create Election"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Elections</CardTitle>
              <CardDescription>View, start, and manage your elections</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>Total Votes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeElections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>{new Date(election.endTime).toLocaleDateString()}</TableCell>
                      <TableCell>{election.candidates.length}</TableCell>
                      <TableCell>{election.totalVotes}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {election.status === "Active" && (
                            <Button variant="outline" size="sm" onClick={() => handleEndElection(election.id)}>
                              End
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/elections/${election.id}`)}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pastElections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>{new Date(election.endTime).toLocaleDateString()}</TableCell>
                      <TableCell>{election.candidates.length}</TableCell>
                      <TableCell>{election.totalVotes}</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          {election.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/elections/${election.id}`)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
