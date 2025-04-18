"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Loader, AlertCircle } from "lucide-react"
import { getReadDaoContract, getWriteDaoContract } from "../../providers/dao_provider"
import { formatEther } from "viem"
import { useSelector, useDispatch } from "react-redux"
import { fetchProposals } from "../../store/slices/proposalsListSlice"

// Import components
import ProposalHeader from "./proposal_components/ProposalHeader"
import ProposalDescription from "./proposal_components/ProposalDescription"
import ProposalLocationMap from "./proposal_components/ProposalLocationMap"
import ProposalEligibilityCriteria from "./proposal_components/ProposalEligibilityCriteria"
import ProposalTimeline from "./proposal_components/ProposalTimeline"
import ProposalVotingCard from "./proposal_components/ProposalVotingCard"
import ProposalVotersSection from "./proposal_components/ProposalVotersSection"

// Default eligibility criteria
const DEFAULT_ELIGIBILITY_CRITERIA = [
  "Must be located within the affected area radius",
  "Must provide proof of residence or presence in the area during the disaster",
  "Must demonstrate financial need or damage caused by the disaster",
  "Must not have received aid from other sources for the same purpose",
]

const ProposalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUserDaoMember, setIsUserDaoMember] = useState(false)
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [showAllVoters, setShowAllVoters] = useState(false)
  const [userAddress, setUserAddress] = useState(null)
  const [voters, setVoters] = useState([])

  // Get proposals from Redux store
  const proposals = useSelector((state) => state.proposalsList.proposals)
  const proposalsLoading = useSelector((state) => state.proposalsList.loading)
  const proposalsError = useSelector((state) => state.proposalsList.error)

  // Connect wallet
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setUserAddress(accounts[0])
        }
      } catch (err) {
        console.error("Error connecting wallet:", err)
      }
    }
    connectWallet()
  }, [])

  // Check DAO membership and voting status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!userAddress || !id) return

      try {
        const contract = getReadDaoContract()
        const [isDaoMember, hasVoted] = await Promise.all([
          contract.publicClient.readContract({
            ...contract,
            functionName: "isDAOMember",
            args: [userAddress],
          }),
          contract.publicClient.readContract({
            ...contract,
            functionName: "hasVoted",
            args: [BigInt(id), userAddress],
          }),
        ])
        setIsUserDaoMember(isDaoMember)
        setHasUserVoted(hasVoted)
      } catch (err) {
        console.error("Error checking user status:", err)
        setError("Failed to verify user status")
      }
    }
    checkUserStatus()
  }, [userAddress, id])

  // Fetch voters (mock, as contract doesn't expose voter list)
  const fetchVoters = async (proposalId) => {
    try {
      // Mock data since contract doesn't provide voters
      const mockVoters = [
        { address: "0x1234...5678", vote: true, timestamp: Date.now() - 86400000 },
        { address: "0x8765...4321", vote: false, timestamp: Date.now() - 43200000 },
        { address: "0xabcd...efgh", vote: true, timestamp: Date.now() - 21600000 },
      ]
      setVoters(mockVoters)
    } catch (err) {
      console.error("Error fetching voters:", err)
      setVoters([])
    }
  }

  // Fetch proposal data from Redux
  useEffect(() => {
    const fetchProposalFromRedux = async () => {
      if (!id) return

      setLoading(true)
      try {
        // If proposals are not in Redux, fetch them
        if (!proposals.length && !proposalsLoading) {
          await dispatch(fetchProposals()).unwrap()
        }

        // Find the proposal in Redux store
        const proposalData = proposals.find(p => p.id === Number(id))
        
        if (!proposalData) {
          throw new Error("Proposal not found")
        }

        const startTimeMs = Number(proposalData.startTime) * 1000
        const endTimeMs = Number(proposalData.endTime) * 1000
        const registrationPeriodDuration = 1 * 60 * 60 * 1000
        const waitingPeriodDuration = 30 * 60 * 1000
        const claimingPeriodDuration = 24 * 60 * 60 * 1000

        const registrationPeriod = {
          start: endTimeMs,
          end: endTimeMs + registrationPeriodDuration,
        }
        const claimingPeriod = {
          start: registrationPeriod.end + waitingPeriodDuration,
          end: registrationPeriod.end + waitingPeriodDuration + claimingPeriodDuration,
        }

        const transformedProposal = {
          id: Number(proposalData.id),
          proposer: proposalData.proposer,
          disasterName: proposalData.disasterName,
          description: proposalData.description || "Disaster Relief Proposal",
          area: proposalData.area,
          location: {
            latitude: Number(proposalData.location?.latitude) || 0,
            longitude: Number(proposalData.location?.longitude) || 0,
            radius: Number(proposalData.location?.radius) || 10,
          },
          fundsRequested: Number(proposalData.fundsRequested),
          startTime: startTimeMs,
          endTime: endTimeMs,
          registrationPeriod,
          claimingPeriod,
          forVotes: Number(proposalData.forVotes),
          againstVotes: Number(proposalData.againstVotes),
          totalDaoMembers: Number(proposalData.totalDaoMembers) || 0,
          image: proposalData.image || "https://images.unsplash.com/photo-1542393545-10f5b85e14fc",
          state: proposalData.state,
          eligibilityCriteria: proposalData.eligibilityCriteria || DEFAULT_ELIGIBILITY_CRITERIA,
        }

        setProposal(transformedProposal)
        await fetchVoters(id)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching proposal:", err)
        setError("Failed to load proposal details")
        setLoading(false)
      }
    }
    fetchProposalFromRedux()
  }, [id, proposals, proposalsLoading, dispatch])

  // Poll proposal state every 30 seconds
  useEffect(() => {
    const pollProposal = async () => {
      if (!id || !proposal) return
      try {
        const contract = getReadDaoContract()
        const proposalData = await contract.publicClient.readContract({
          ...contract,
          functionName: "getProposal",
          args: [BigInt(id)],
        })
        setProposal((prev) => ({
          ...prev,
          state: Number(proposalData.state),
          forVotes: Number(proposalData.forVotes),
          againstVotes: Number(proposalData.againstVotes),
        }))
      } catch (err) {
        console.error("Error polling proposal:", err)
      }
    }
    pollProposal()
    const interval = setInterval(pollProposal, 30000)
    return () => clearInterval(interval)
  }, [id, proposal])

  if (loading && !proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading proposal details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dao")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Return to Proposals
          </button>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Proposal Not Found</h2>
          <p className="text-gray-600 mb-4">The proposal doesn't exist.</p>
          <button
            onClick={() => navigate("/dao")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Return to Proposals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading && proposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <Loader className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/dao")}
          className="mb-6 flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Proposals</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div className="lg:col-span-2 space-y-8">
            <ProposalHeader proposal={proposal} />
            <ProposalDescription proposal={proposal} />
            <ProposalLocationMap proposal={proposal} />
            <ProposalEligibilityCriteria proposal={proposal} />
            <ProposalTimeline proposal={proposal} />
          </motion.div>

          <motion.div className="space-y-8">
            <ProposalVotingCard
              proposal={proposal}
              isUserDaoMember={isUserDaoMember}
              hasUserVoted={hasUserVoted}
              userAddress={userAddress}
            />
            <ProposalVotersSection
              voters={voters}
              showAllVoters={showAllVoters}
              setShowAllVoters={setShowAllVoters}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProposalDetails