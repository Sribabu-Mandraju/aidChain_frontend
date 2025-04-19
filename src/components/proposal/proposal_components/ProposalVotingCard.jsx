"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, ThumbsUp, ThumbsDown, Loader } from "lucide-react"
import { useAccount, useWalletClient } from "wagmi"
import { toast } from "react-hot-toast"
import { createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"
import { vote, isDAOMember, getProposal, memberCount, hasVoted, executeProposal, finalizeProposal } from "../../../providers/dao_provider"
import { fetchCampaigns } from "../../../store/slices/campaignSlice"
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://base-sepolia.g.alchemy.com/v2/kBfhfjgaUbr1xz7I4QTPU7ZepOM6uMxK"),
})

const ProposalVotingCard = ({ proposal, isUserDaoMember, hasUserVoted, userAddress }) => {
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false)
  const [currentVoteType, setCurrentVoteType] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState(null)
  const [isOperator, setIsOperator] = useState(false)
  const [isOperatorLoading, setIsOperatorLoading] = useState(true)
  const [totalMembers, setTotalMembers] = useState(0)
  const [requiredVotes, setRequiredVotes] = useState(0)
  const [currentProposal, setCurrentProposal] = useState({
    ...proposal,
    state: Number(proposal.state),
    forVotes: Number(proposal.forVotes),
    againstVotes: Number(proposal.againstVotes),
  })
  const { isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  // Validate proposal
  if (!proposal || !proposal.id) {
    console.error("Invalid proposal data:", proposal)
    return <div className="text-red-600">Error: Invalid proposal data</div>
  }

  // Calculate required votes (60%)
  useEffect(() => {
    const calculateRequiredVotes = async () => {
      try {
        const total = await memberCount()
        const totalNum = Number(total) || 0
        console.log("Total DAO Members:", totalNum)
        setTotalMembers(totalNum)
        const required = Math.ceil((60 * totalNum) / 100)
        console.log("Required Votes (60%):", required)
        setRequiredVotes(required)
      } catch (error) {
        console.error("Error calculating required votes:", error)
        toast.error("Failed to fetch DAO member count")
      }
    }
    calculateRequiredVotes()
  }, [])

  // Check operator status and refresh proposal
  useEffect(() => {
    let isMounted = true
    const checkStatus = async () => {
      if (!userAddress) {
        if (isMounted) {
          setIsOperator(false)
          setIsOperatorLoading(false)
        }
        return
      }

      setIsOperatorLoading(true)
      try {
        // Retry logic for network issues
        let operator
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            operator = await publicClient.readContract({
              address: import.meta.env.VITE_DAO_GOVERNANCE,
              abi: [
                {
                  name: "operator",
                  type: "function",
                  stateMutability: "view",
                  inputs: [],
                  outputs: [{ type: "address" }],
                },
              ],
              functionName: "operator",
            })
            break
          } catch (err) {
            if (attempt === 3) throw err
            console.warn(`Operator check attempt ${attempt} failed:`, err)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }

        const isOp = operator.toLowerCase() === userAddress.toLowerCase()
        console.log("Contract operator:", operator)
        console.log("User address:", userAddress)
        console.log("Is Operator:", isOp)

        if (isMounted) {
          setIsOperator(isOp)
          setIsOperatorLoading(false)
        }

        // Refresh proposal data
        const updatedProposal = await getProposal(proposal.id)
        if (isMounted) {
          setCurrentProposal({
            ...updatedProposal,
            id: Number(updatedProposal.id),
            state: Number(updatedProposal.state),
            forVotes: Number(updatedProposal.forVotes),
            againstVotes: Number(updatedProposal.againstVotes),
          })
        }
      } catch (error) {
        console.error("Error checking operator status:", error)
        if (isMounted) {
          toast.error("Failed to verify operator status")
          setIsOperatorLoading(false)
        }
      }
    }

    checkStatus()
    return () => {
      isMounted = false
    }
  }, [userAddress, proposal.id])

  // Finalize proposal if voting period ended
  useEffect(() => {
    const checkVotingPeriod = async () => {
      if (currentProposal.state !== 0 || !currentProposal.endTime) return
      const now = Date.now()
      if (now > currentProposal.endTime) {
        try {
          await finalizeProposal(proposal.id)
          const updatedProposal = await getProposal(proposal.id)
          setCurrentProposal({
            ...updatedProposal,
            id: Number(updatedProposal.id),
            state: Number(updatedProposal.state),
            forVotes: Number(updatedProposal.forVotes),
            againstVotes: Number(updatedProposal.againstVotes),
          })
        } catch (error) {
          console.error("Error finalizing proposal:", error)
        }
      }
    }
    checkVotingPeriod()
  }, [currentProposal.state, currentProposal.endTime, proposal.id])

  // Handle vote
  const handleVote = useCallback(
    (voteType) => {
      if (!isConnected || !userAddress) {
        toast.error("Please connect your wallet")
        return
      }
      if (!isUserDaoMember) {
        toast.error("Only DAO members can vote")
        return
      }
      if (hasUserVoted) {
        toast.error("You have already voted")
        return
      }
      if (currentProposal.state !== 0) {
        toast.error("Voting is closed")
        return
      }

      // Convert blockchain timestamps (in seconds) to milliseconds
      const currentTimeMs = Date.now()
      const startTimeMs = Number(currentProposal.startTime) * 1000
      const endTimeMs = Number(currentProposal.endTime) * 1000

      if (currentTimeMs < startTimeMs) {
        toast.error("Voting period has not started yet")
        return
      }
      if (currentTimeMs > endTimeMs) {
        toast.error("Voting period has ended")
        return
      }

      setCurrentVoteType(voteType)
      setIsVoteModalOpen(true)
    },
    [isConnected, userAddress, isUserDaoMember, hasUserVoted, currentProposal.state, currentProposal.startTime, currentProposal.endTime]
  )

  // Submit vote
  const onVote = useCallback(async () => {
    if (!isConnected || !userAddress || !walletClient) {
      toast.error("Wallet not connected")
      setIsVoteModalOpen(false)
      return
    }
    setIsVoting(true)
    const toastId = toast.loading("Submitting vote...")
    try {
      const hash = await vote(proposal.id, currentVoteType === "for")
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      if (receipt.status === "success") {
        toast.success(
          <div>
            <span>Vote submitted!</span>
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View transaction
            </a>
          </div>,
          { id: toastId, duration: 5000 }
        )
        const updatedProposal = await getProposal(proposal.id)
        setCurrentProposal({
          ...updatedProposal,
          id: Number(updatedProposal.id),
          state: Number(updatedProposal.state),
          forVotes: Number(updatedProposal.forVotes),
          againstVotes: Number(updatedProposal.againstVotes),
        })
      } else {
        throw new Error("Transaction reverted")
      }
    } catch (error) {
      console.error("Voting error:", error)
      const errorMessage = error.message.includes("not active")
        ? "Voting is closed"
        : error.message.includes("Already voted")
        ? "You have already voted"
        : error.message.includes("gas")
        ? "Gas estimation failed"
        : "Failed to vote"
      toast.error(errorMessage, { id: toastId })
      setError(errorMessage)
    } finally {
      setIsVoting(false)
      setIsVoteModalOpen(false)
      setCurrentVoteType(null)
    }
  }, [isConnected, userAddress, walletClient, currentVoteType, proposal.id])

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (!isConnected || !userAddress || !walletClient) {
      toast.error("Please connect your wallet")
      return
    }
    if (!isOperator) {
      toast.error("Only the operator can approve")
      return
    }
    if (currentProposal.state !== 1) {
      toast.error("Proposal must be Passed")
      return
    }
    setIsExecuting(true)
    const toastId = toast.loading("Approving proposal...")
    try {
      let gasEstimate
      try {
        gasEstimate = await publicClient.estimateContractGas({
          address:import.meta.env.VITE_DAO_GOVERNANCE,
          abi: [
            {
              name: "executeProposal",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [{ type: "uint256" }],
              outputs: [],
            },
          ],
          functionName: "executeProposal",
          args: [BigInt(proposal.id)],
          account: userAddress,
        })
      } catch (gasError) {
        console.warn("Gas estimation failed:", gasError)
        gasEstimate = BigInt(5000000)
      }
      const hash = await executeProposal(proposal.id)
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      if (receipt.status === "success") {
        toast.success(
          <div>
            <span>Proposal approved!</span>
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View transaction
            </a>
          </div>,
          { id: toastId, duration: 5000 }
        )
        setCurrentProposal((prev) => ({
          ...prev,
          state: 3, // Executed
        }))
      } else {
        throw new Error("Transaction reverted")
      }
    } catch (error) {
      console.error("Approval error:", error)
      const errorMessage = error.message.includes("Only the operator")
        ? "Only the operator can approve"
        : error.message.includes("does not exist")
        ? "Proposal must be Passed"
        : error.message.includes("Insufficient funds")
        ? "Not enough funds in escrow"
        : error.message.includes("gas")
        ? "Gas estimation failed"
        : "Failed to approve"
      toast.error(errorMessage, { id: toastId })
      setError(errorMessage)
    } finally {
      setIsExecuting(false)
      setIsExecuteModalOpen(false)
    }
  }, [isConnected, userAddress, walletClient, isOperator, currentProposal.state, proposal.id])

  // Calculate vote percentage
  const votePercentage = totalMembers > 0 ? Math.min((currentProposal.forVotes / totalMembers) * 100, 100) : 0

  // Determine approval status
  const approvalStatus = {
    status:
      currentProposal.state === 0
        ? currentProposal.forVotes >= requiredVotes
          ? "Passing"
          : Date.now() > (Number(currentProposal.endTime) * 1000)
          ? "Pending Finalization"
          : "Pending"
        : currentProposal.state === 1
        ? "Passed"
        : "Rejected",
    color:
      currentProposal.state === 0
        ? currentProposal.forVotes >= requiredVotes
          ? "bg-green-500"
          : Date.now() > (Number(currentProposal.endTime) * 1000)
          ? "bg-gray-500"
          : "bg-yellow-500"
        : currentProposal.state === 1
        ? "bg-green-500"
        : "bg-red-500"
  }

  // Helper function to render voting status message
  const renderVotingStatusMessage = () => {
    switch (currentProposal.state) {
      case 1: // Passed
        return (
          <div className="mb-6 p-4 bg-green-50 rounded-lg text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">This proposal has passed</p>
            <p className="text-sm text-green-600">
              Final votes: {currentProposal.forVotes} For, {currentProposal.againstVotes} Against
            </p>
          </div>
        );
      case 2: // Rejected
        return (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">This proposal has been rejected</p>
            <p className="text-sm text-red-600">
              Final votes: {currentProposal.forVotes} For, {currentProposal.againstVotes} Against
            </p>
          </div>
        );
      case 3: // Executed
        return (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
            <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">This proposal has been executed</p>
            <p className="text-sm text-blue-600">
              Final votes: {currentProposal.forVotes} For, {currentProposal.againstVotes} Against
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-md overflow-hidden sticky top-[75px]"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Proposal Voting</h2>

        {!isConnected ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">Please connect your wallet to vote.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Connected: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not connected"}
              </span>
              <div className="flex gap-2">
                {isUserDaoMember && <span className="text-sm text-green-600 font-medium">DAO Member</span>}
                {isOperatorLoading ? (
                  <Loader className="h-4 w-4 text-blue-600 animate-spin" />
                ) : (
                  isOperator && <span className="text-sm text-blue-600 font-medium">Operator</span>
                )}
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Voting Requirements</h3>
              <p className="text-sm text-gray-600">Total Members: <span className="font-medium">{totalMembers}</span></p>
              <p className="text-sm text-gray-600">
                Required Votes: <span className="font-medium">{requiredVotes} (60%)</span>
              </p>
              <p className="text-sm text-gray-600">
                For Votes: <span className="font-medium">{currentProposal.forVotes}</span>
              </p>
              <p className="text-sm text-gray-600">
                Against Votes: <span className="font-medium">{currentProposal.againstVotes}</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Approval Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${approvalStatus.color}`}>
                  {approvalStatus.status}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5 mb-1">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${votePercentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{votePercentage.toFixed(1)}% Approval</span>
                <span>60% Required</span>
              </div>
            </div>

            {/* Voting status message */}
            {renderVotingStatusMessage()}

            {/* Voting stats - show regardless of state */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Voting Results</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{currentProposal.forVotes}</div>
                  <div className="text-sm text-gray-600">For</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{currentProposal.againstVotes}</div>
                  <div className="text-sm text-gray-600">Against</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Required Votes: <span className="font-medium">{requiredVotes} (60%)</span>
              </div>
            </div>

            {/* Show voting buttons only if proposal is active (state 0) */}
            {currentProposal.state === 0 && (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote("for")}
                  className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                >
                  <ThumbsUp className="h-5 w-5" />
                  Vote For
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote("against")}
                  className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
                >
                  <ThumbsDown className="h-5 w-5" />
                  Vote Against
                </motion.button>
              </div>
            )}

            {/* Show approve button only for operator when proposal is passed */}
            {currentProposal.state === 1 && isOperator && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExecuteModalOpen(true)}
                className="w-full mt-4 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Approve Proposal
              </motion.button>
            )}
          </>
        )}
      </div>

      {isVoteModalOpen && (
        <ProposalVoteModal
          onClose={() => {
            setIsVoteModalOpen(false)
            setCurrentVoteType(null)
          }}
          onConfirm={onVote}
          proposal={currentProposal}
          voteType={currentVoteType}
          isLoading={isVoting}
        />
      )}

      {isExecuteModalOpen && (
        <ApproveProposalModal
          onClose={() => setIsExecuteModalOpen(false)}
          onConfirm={handleApprove}
          proposal={currentProposal}
          isLoading={isExecuting}
        />
      )}
    </motion.div>
  )
}

const ProposalVoteModal = ({ onClose, onConfirm, proposal, voteType, isLoading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full">
      <h3 className="text-xl font-semibold mb-4">Confirm Your Vote</h3>
      <p className="mb-6">
        You are voting{" "}
        <span className={voteType === "for" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          {voteType === "for" ? "FOR" : "AGAINST"}
        </span>{" "}
        the proposal:
        <br />
        <span className="font-medium">{proposal.disasterName || `Proposal #${proposal.id}`}</span>
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-lg text-white ${
            isLoading
              ? "bg-gray-400"
              : voteType === "for"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </div>
          ) : (
            "Confirm Vote"
          )}
        </button>
      </div>
    </div>
  </div>
)

const ApproveProposalModal = ({ onClose, onConfirm, proposal, isLoading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full">
      <h3 className="text-xl font-semibold mb-4">Approve Proposal</h3>
      <p className="mb-6">
        You are approving:
        <br />
        <span className="font-medium">{proposal.disasterName || `Proposal #${proposal.id}`}</span>
        <br />
        This will deploy a DisasterRelief contract.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-lg text-white ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Approving...
            </div>
          ) : (
            "Confirm Approval"
          )}
        </button>
      </div>
    </div>
  </div>
)

export default ProposalVotingCard