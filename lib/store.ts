// This file simulates a shared data store that would be replaced by blockchain data in a real implementation

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Candidate = {
  id: string
  name: string
  party: string
  votes: number
  winner?: boolean
}

export type Transaction = {
  hash: string
  voter: string
  candidate: string
  timestamp: Date
}

export type Election = {
  id: string
  title: string
  description: string
  endTime: Date
  candidates: Candidate[]
  totalVotes: number
  status: "Pending" | "Active" | "Ended"
  transactions: Transaction[]
  hasVoted?: boolean
}

export type Voter = {
  address: string
  registered: boolean
  hasVoted: boolean
  votedFor?: string
  timestamp?: Date
}

type ElectionStore = {
  activeElections: Election[]
  pastElections: Election[]
  voters: Record<string, Voter[]> // Map of election ID to voters
  votedElections: Record<string, boolean> // Map of election ID to whether current user has voted

  // Actions
  addElection: (election: Election) => void
  updateElection: (electionId: string, updates: Partial<Election>) => void
  endElection: (electionId: string) => void
  castVote: (electionId: string, candidateId: string, voterAddress: string, candidateName: string) => void
  markElectionAsVoted: (electionId: string) => void
  getVotersForElection: (electionId: string) => Voter[]
  getTransactionsForElection: (electionId: string) => Transaction[]
  getElectionById: (electionId: string) => Election | undefined
  getWinnerForElection: (electionId: string) => Candidate | undefined
  getRecentlyEndedElections: () => Election[]
}

// Generate a random transaction hash
const generateTransactionHash = () => {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

// Shorten an Ethereum address for display
export const shortenAddress = (address: string) => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Initial elections data
const initialActiveElections: Election[] = [
  {
    id: "1",
    title: "City Council Election 2023",
    description: "Vote for your local city council representative",
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    candidates: [
      { id: "1", name: "Jane Smith", party: "Progressive Party", votes: 145 },
      { id: "2", name: "John Doe", party: "Conservative Party", votes: 120 },
      { id: "3", name: "Alex Johnson", party: "Independent", votes: 78 },
    ],
    totalVotes: 343,
    status: "Active",
    transactions: [],
  },
  {
    id: "2",
    title: "School Board Election",
    description: "Select members for the local school board",
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    candidates: [
      { id: "1", name: "Robert Wilson", party: "Education First", votes: 89 },
      { id: "2", name: "Maria Garcia", party: "Future Leaders", votes: 102 },
      { id: "3", name: "David Chen", party: "Community Voice", votes: 67 },
    ],
    totalVotes: 258,
    status: "Active",
    transactions: [],
  },
]

const initialPastElections: Election[] = [
  {
    id: "5",
    title: "Mayor Election 2022",
    description: "Election for the city mayor position",
    endTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    candidates: [
      { id: "1", name: "Michael Brown", party: "Progressive Party", votes: 1245, winner: true },
      { id: "2", name: "Sarah Miller", party: "Conservative Party", votes: 1120 },
      { id: "3", name: "James Wilson", party: "Independent", votes: 578 },
    ],
    totalVotes: 2943,
    status: "Ended",
    transactions: [],
  },
]

export const useElectionStore = create<ElectionStore>()(
  persist(
    (set, get) => ({
      activeElections: initialActiveElections,
      pastElections: initialPastElections,
      voters: {},
      votedElections: {},

      addElection: (election) =>
        set((state) => ({
          activeElections: [...state.activeElections, election],
        })),

      updateElection: (electionId, updates) =>
        set((state) => ({
          activeElections: state.activeElections.map((election) =>
            election.id === electionId ? { ...election, ...updates } : election,
          ),
          pastElections: state.pastElections.map((election) =>
            election.id === electionId ? { ...election, ...updates } : election,
          ),
        })),

      endElection: (electionId) => {
        const { activeElections } = get()
        const election = activeElections.find((e) => e.id === electionId)

        if (!election) return

        // Find the winner
        const winner = [...election.candidates].sort((a, b) => b.votes - a.votes)[0]

        // Update the candidates to mark the winner
        const updatedCandidates = election.candidates.map((candidate) =>
          candidate.id === winner.id ? { ...candidate, winner: true } : candidate,
        )

        // Move the election from active to past
        set((state) => ({
          activeElections: state.activeElections.filter((e) => e.id !== electionId),
          pastElections: [
            ...state.pastElections,
            {
              ...election,
              status: "Ended",
              candidates: updatedCandidates,
            },
          ],
        }))
      },

      castVote: (electionId, candidateId, voterAddress, candidateName) => {
        // Create a new transaction
        const transaction: Transaction = {
          hash: generateTransactionHash(),
          voter: voterAddress,
          candidate: candidateName,
          timestamp: new Date(),
        }

        // Add voter to the election's voters
        const electionVoters = get().voters[electionId] || []
        const updatedVoters = {
          ...get().voters,
          [electionId]: [
            ...electionVoters,
            {
              address: voterAddress,
              registered: true,
              hasVoted: true,
              votedFor: candidateName,
              timestamp: new Date(),
            },
          ],
        }

        // Update the election
        set((state) => ({
          activeElections: state.activeElections.map((election) => {
            if (election.id === electionId) {
              // Update candidate votes
              const updatedCandidates = election.candidates.map((candidate) => {
                if (candidate.id === candidateId) {
                  return { ...candidate, votes: candidate.votes + 1 }
                }
                return candidate
              })

              return {
                ...election,
                candidates: updatedCandidates,
                totalVotes: election.totalVotes + 1,
                transactions: [transaction, ...election.transactions],
              }
            }
            return election
          }),
          voters: updatedVoters,
          votedElections: {
            ...state.votedElections,
            [electionId]: true,
          },
        }))
      },

      markElectionAsVoted: (electionId) =>
        set((state) => ({
          votedElections: {
            ...state.votedElections,
            [electionId]: true,
          },
        })),

      getVotersForElection: (electionId) => {
        return get().voters[electionId] || []
      },

      getTransactionsForElection: (electionId) => {
        const activeElection = get().activeElections.find((e) => e.id === electionId)
        if (activeElection) return activeElection.transactions

        const pastElection = get().pastElections.find((e) => e.id === electionId)
        if (pastElection) return pastElection.transactions

        return []
      },

      getElectionById: (electionId) => {
        const activeElection = get().activeElections.find((e) => e.id === electionId)
        if (activeElection) return activeElection

        const pastElection = get().pastElections.find((e) => e.id === electionId)
        if (pastElection) return pastElection

        return undefined
      },

      getWinnerForElection: (electionId) => {
        const election = get().getElectionById(electionId)
        if (!election || election.status !== "Ended") return undefined

        return election.candidates.find((c) => c.winner)
      },

      getRecentlyEndedElections: () => {
        // Get elections that ended in the last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return get().pastElections.filter((e) => e.status === "Ended" && new Date(e.endTime) > oneDayAgo)
      },
    }),
    {
      name: "election-store",
      partialize: (state) => ({
        votedElections: state.votedElections,
      }),
    },
  ),
)
