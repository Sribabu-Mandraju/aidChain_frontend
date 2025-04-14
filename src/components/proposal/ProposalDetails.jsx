"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Loader, AlertCircle } from "lucide-react"
import { getReadDaoContract, getWriteDaoContract } from "../../providers/dao_provider"
import { formatEther } from "viem"

// Import new components
import ProposalHeader from "./proposal_components/ProposalHeader"
import ProposalDescription from "./proposal_components/ProposalDescription"
import ProposalLocationMap from "./proposal_components/ProposalLocationMap"
import ProposalEligibilityCriteria from "./proposal_components/ProposalEligibilityCriteria"
import ProposalTimeline from "./proposal_components/ProposalTimeline"
import ProposalVotingCard from "./proposal_components/ProposalVotingCard"
import ProposalVotersSection from "./proposal_components/ProposalVotersSection"

// Default eligibility criteria if not provided by contract
const DEFAULT_ELIGIBILITY_CRITERIA = [
  "Must be located within the affected area radius",
  "Must provide proof of residence or presence in the area during the disaster",
  "Must demonstrate financial need or damage caused by the disaster",
  "Must not have received aid from other sources for the same purpose",
]

const ProposalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isUserDaoMember, setIsUserDaoMember] = useState(false)
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [showAllVoters, setShowAllVoters] = useState(false)
  const [userAddress, setUserAddress] = useState(null)
  const [currentVoteType, setCurrentVoteType] = useState(null)
  const [voters, setVoters] = useState([])

  // Separate useEffect for wallet connection
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const contract = await getWriteDaoContract()
        if (contract && contract.address) {
          setUserAddress(contract.address)
        }
      } catch (err) {
        console.error("Error connecting wallet:", err)
      }
    }
    connectWallet()
  }, [])

  // Separate useEffect for checking DAO membership and voting status
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!userAddress || !id) return

      try {
        const contract = getReadDaoContract()

        // Check if user is DAO member
        const isDaoMember = await contract.publicClient.readContract({
          ...contract,
          functionName: "isDAOMember",
          args: [userAddress],
        })
        setIsUserDaoMember(isDaoMember)

        // Check if user has voted
        if (id) {
          const hasVoted = await contract.publicClient.readContract({
            ...contract,
            functionName: "hasVoted",
            args: [BigInt(id), userAddress],
          })
          setHasUserVoted(hasVoted)
        }
      } catch (err) {
        console.error("Error checking user status:", err)
      }
    }

    if (userAddress && proposal?.id) {
      checkUserStatus()
    }
  }, [userAddress, id, proposal?.id])

  // Function to fetch voters for a proposal
  const fetchVoters = async (proposalId) => {
    try {
      const contract = getReadDaoContract()

      // Placeholder: contract doesn't provide voters list directly
      // Using mock data as in original
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

  // Main useEffect for fetching proposal data
  useEffect(() => {
    const fetchProposalFromChain = async () => {
      if (!id) return

      setLoading(true)
      try {
        const contract = getReadDaoContract()

        // Get proposal data
        const proposalData = await contract.publicClient.readContract({
          ...contract,
          functionName: "getProposal",
          args: [BigInt(id)],
        })

        // Get total DAO members
        const totalMembers = await contract.publicClient.readContract({
          ...contract,
          functionName: "memberCount",
        })

        // Convert blockchain timestamps (in seconds) to milliseconds
        const startTimeMs = Number(proposalData.startTime) * 1000
        const endTimeMs = Number(proposalData.endTime) * 1000

        // Calculate periods based on contract logic
        const registrationPeriodDuration = 1 * 60 * 60 * 1000 // 1 hour in milliseconds
        const waitingPeriodDuration = 30 * 60 * 1000 // 30 minutes in milliseconds
        const claimingPeriodDuration = 24 * 60 * 60 * 1000 // 1 day in milliseconds

        const registrationPeriod = {
          start: endTimeMs, // Starts after voting ends
          end: endTimeMs + registrationPeriodDuration, // 1 hour after start
        }

        const claimingPeriod = {
          start: registrationPeriod.end + waitingPeriodDuration, // Starts after registration + 30 min waiting
          end: registrationPeriod.end + waitingPeriodDuration + claimingPeriodDuration, // 1 day after start
        }

        // Transform blockchain data
        const transformedProposal = {
          id: Number(proposalData.id),
          proposer: proposalData.proposer,
          disasterName: proposalData.disasterName,
          description: proposalData.description || "Disaster Relief Proposal",
          area: `${proposalData.location.country}, ${proposalData.location.state}, ${proposalData.location.city}, ${proposalData.location.zipCode}`,
          location: {
            latitude: proposalData.location.latitude ? Number(proposalData.location.latitude) : 0,
            longitude: proposalData.location.longitude ? Number(proposalData.location.longitude) : 0,
            radius: proposalData.location.radius ? Number(proposalData.location.radius) : 10,
          },
          fundsRequested: Number(formatEther(proposalData.fundsRequested)),
          startTime: startTimeMs,
          endTime: endTimeMs,
          registrationPeriod,
          claimingPeriod,
          forVotes: Number(proposalData.forVotes),
          againstVotes: Number(proposalData.againstVotes),
          totalDaoMembers: Number(totalMembers),
          image: proposalData.image || "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          state: getProposalState(proposalData.state),
          eligibilityCriteria: proposalData.eligibilityCriteria || DEFAULT_ELIGIBILITY_CRITERIA,
        }

        setProposal(transformedProposal)

        // Fetch voters for this proposal
        await fetchVoters(id)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching proposal:", err)
        setError("Failed to load proposal details. Please try again later.")
        setLoading(false)
      }
    }

    fetchProposalFromChain()
  }, [id])

  // Modified vote handler
  const handleVote = async (voteType) => {
    if (!userAddress) {
      alert("Please connect your wallet first")
      return
    }

    if (!isUserDaoMember) {
      alert("Only DAO members can vote on proposals")
      return
    }

    if (hasUserVoted) {
      alert("You have already voted on this proposal")
      return
    }

    setCurrentVoteType(voteType)
    setIsVoteModalOpen(true)
  }

  const confirmVote = async () => {
    if (!currentVoteType) return

    try {
      const contract = await getWriteDaoContract()

      // Show loading state
      setLoading(true)

      const tx = await contract.walletClient.writeContract({
        ...contract,
        functionName: "vote",
        args: [BigInt(id), currentVoteType === "for"],
      })

      // Wait for transaction confirmation
      await contract.publicClient.waitForTransactionReceipt({ hash: tx })

      // Update local state
      setHasUserVoted(true)
      setProposal((prev) => ({
        ...prev,
        forVotes: currentVoteType === "for" ? prev.forVotes + 1 : prev.forVotes,
        againstVotes: currentVoteType === "against" ? prev.againstVotes + 1 : prev.againstVotes,
      }))

      // Add the user's vote to the voters list
      const newVote = {
        address: userAddress,
        vote: currentVoteType === "for",
        timestamp: Date.now(),
      }

      setVoters((prev) => [newVote, ...prev])

      setIsVoteModalOpen(false)
      setLoading(false)
    } catch (err) {
      console.error("Error voting:", err)
      alert("Failed to submit vote. Please try again.")
      setLoading(false)
    }
  }

  // Helper function to convert contract state to display state
  const getProposalState = (stateNumber) => {
    const states = {
      0: "Active",
      1: "Passed",
      2: "Rejected",
      3: "Executed",
    }
    return states[stateNumber] || "Unknown"
  }

  // Vote percentage
  const getVotePercentage = () => {
    if (!proposal) return 0
    const totalVotes = proposal.forVotes + proposal.againstVotes
    return totalVotes > 0 ? Math.round((proposal.forVotes / totalVotes) * 100) : 0
  }

  // Approval status
  const getApprovalStatus = () => {
    if (!proposal) return { status: "Pending", color: "bg-gray-500" }

    const totalVotes = proposal.forVotes + proposal.againstVotes
    // Calculate required votes (60% of total members)
    const requiredVotes = Math.ceil((60 * proposal.totalDaoMembers) / 100)

    if (proposal.state !== "Active") {
      return proposal.state === "Passed" || proposal.state === "Executed"
        ? { status: "Approved", color: "bg-green-500" }
        : { status: "Rejected", color: "bg-red-500" }
    }

    if (proposal.forVotes >= requiredVotes) {
      return { status: "Passing", color: "bg-green-500" }
    } else if (proposal.againstVotes >= requiredVotes) {
      return { status: "Failing", color: "bg-red-500" }
    } else {
      return { status: "Active", color: "bg-yellow-500" }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

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
          <p className="text-gray-600 mb-4">The proposal you're looking for doesn't exist or has been removed.</p>
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

  const approvalStatus = getApprovalStatus()
  const votePercentage = getVotePercentage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading && proposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <Loader className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
            <p className="text-gray-700">Processing your request...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Back button */}
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Main Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <ProposalHeader proposal={proposal} />
            <ProposalDescription proposal={proposal} />
            <ProposalLocationMap proposal={proposal} />
            <ProposalEligibilityCriteria proposal={proposal} />
            <ProposalTimeline proposal={proposal} />
          </motion.div>

          {/* Right Column - Voting & Stats */}
          <motion.div variants={itemVariants} className="space-y-8">
            <ProposalVotingCard
              proposal={proposal}
              isUserDaoMember={isUserDaoMember}
              hasUserVoted={hasUserVoted}
              userAddress={userAddress}
              isVoteModalOpen={isVoteModalOpen}
              setIsVoteModalOpen={setIsVoteModalOpen}
              currentVoteType={currentVoteType}
              setCurrentVoteType={setCurrentVoteType}
              onVote={confirmVote}
              approvalStatus={approvalStatus}
              votePercentage={votePercentage}
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