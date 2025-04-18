import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getReadDaoContract } from "../../providers/dao_provider"
import { formatAddress, formatCurrency, calculateTimeLeft } from "../../utils/dao_helper"

// Async thunk to fetch all proposals
export const fetchProposals = createAsyncThunk(
  "proposalsList/fetchProposals",
  async (_, { rejectWithValue }) => {
    try {
      const contract = await getReadDaoContract()
      if (!contract || !contract.publicClient) {
        throw new Error("DAO contract or public client not available")
      }

      // Get total proposal count
      const proposalCount = await contract.publicClient.readContract({
        ...contract,
        functionName: "proposalCount",
        args: [],
      })

      const fetchedProposals = []

      // Fetch each proposal from 1 to proposalCount
      for (let id = 1; id <= Number(proposalCount); id++) {
        try {
          const proposal = await contract.publicClient.readContract({
            ...contract,
            functionName: "getProposal",
            args: [BigInt(id)],
          })

          // Format proposal data
          const formattedProposal = {
            id: Number(proposal.id),
            proposer: proposal.proposer,
            disasterName: proposal.disasterName,
            area: `${proposal.location.latitude}, ${proposal.location.longitude} (Radius: ${proposal.location.radius})`,
            fundsRequested: Number(proposal.fundsRequested) / 1e18, // Convert wei to ETH
            forVotes: Number(proposal.forVotes),
            againstVotes: Number(proposal.againstVotes),
            startTime: Number(proposal.startTime),
            endTime: Number(proposal.endTime),
            image: proposal.image,
            state: proposal.state === 0 ? "Active" : 
                   proposal.state === 1 ? "Passed" : 
                   proposal.state === 2 ? "Rejected" : "Unknown"
          }

          fetchedProposals.push(formattedProposal)
        } catch (error) {
          console.warn(`Failed to fetch proposal ID ${id}:`, error)
          // Skip invalid proposals silently
          continue
        }
      }

      return fetchedProposals
    } catch (error) {
      console.error("Error fetching proposals:", error)
      return rejectWithValue(error.message)
    }
  }
)

// Initial state
const initialState = {
  proposals: [],
  loading: false,
  error: null,
  lastFetchTime: null,
}

// Create slice
const proposalsListSlice = createSlice({
  name: "proposalsList",
  initialState,
  reducers: {
    clearProposals: (state) => {
      state.proposals = []
      state.loading = false
      state.error = null
      state.lastFetchTime = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.proposals = action.payload
        state.loading = false
        state.error = null
        state.lastFetchTime = Date.now()
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Export actions
export const { clearProposals } = proposalsListSlice.actions

// Export selectors
export const selectProposals = (state) => state.proposalsList.proposals
export const selectProposalsLoading = (state) => state.proposalsList.loading
export const selectProposalsError = (state) => state.proposalsList.error
export const selectProposalsLastFetchTime = (state) => state.proposalsList.lastFetchTime

export default proposalsListSlice.reducer 