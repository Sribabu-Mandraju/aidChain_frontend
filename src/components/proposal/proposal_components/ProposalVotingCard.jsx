import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import daoABI from "../../../abis/daoGovernance.json";
import { vote, isDAOMember, getProposal, memberCount } from "../../../providers/dao_provider";
// import ProposalVoteModal from "./ProposalVoteModal";

// Initialize public client for transaction receipt
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// DAO contract address
const DAO_CONTRACT_ADDRESS = "0x1b105d0FcCF76aa7a5Aca51e1135DCC4F8Be2307";

const ProposalVotingCard = ({ proposal, hasUserVoted, approvalStatus, votePercentage }) => {
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [currentVoteType, setCurrentVoteType] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  const [isUserDaoMember, setIsUserDaoMember] = useState(false);
  const [totalMembers, setTotalMembers] = useState(0);
  const [requiredVotes, setRequiredVotes] = useState(0);

  // Use the existing wallet connection from navbar
  const { address: userAddress, isConnected } = useAccount();

  // Calculate required votes (60% of total members)
  useEffect(() => {
    const calculateRequiredVotes = async () => {
      try {
        const total = await memberCount();
        setTotalMembers(total);
        // Calculate 60% of total members, rounded up
        const required = Math.ceil((60 * total) / 100);
        setRequiredVotes(required);
      } catch (error) {
        console.error("Error calculating required votes:", error);
      }
    };

    calculateRequiredVotes();
  }, []);

  // Check DAO membership when user address changes
  useEffect(() => {
    const checkMembership = async () => {
      if (userAddress) {
        try {
          const isMember = await isDAOMember(userAddress);
          setIsUserDaoMember(isMember);
        } catch (error) {
          console.error("Error checking DAO membership:", error);
          setIsUserDaoMember(false);
        }
      }
    };

    checkMembership();
  }, [userAddress]);

  // Handle vote initiation
  const handleVote = useCallback(
    (voteType) => {
      if (!isConnected || !userAddress) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!isUserDaoMember) {
        toast.error("Only DAO members can vote on proposals");
        return;
      }

      setCurrentVoteType(voteType);
      setIsVoteModalOpen(true);
    },
    [isConnected, userAddress, isUserDaoMember]
  );

  // Handle vote submission
  const onVote = useCallback(async () => {
    if (!isConnected || !userAddress) {
      toast.error("Wallet not connected");
      setIsVoteModalOpen(false);
      return;
    }

    if (!isUserDaoMember) {
      toast.error("Only DAO members can vote on proposals");
      setIsVoteModalOpen(false);
      return;
    }

    setIsVoting(true);
    setError(null);
    const toastId = toast.loading("Submitting vote...");

    try {
      const hash = await vote(proposal.id, currentVoteType === "for");
      
      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === "success") {
        // Check if proposal passed after vote
        const updatedProposal = await getProposal(proposal.id);
        const isPassed = updatedProposal.state === "Passed";
        
        toast.success(
          <div className="flex flex-col">
            <span>Vote submitted successfully!</span>
            {isPassed && (
              <span className="text-green-600 font-semibold">
                Proposal passed! A new DisasterRelief contract will be deployed.
              </span>
            )}
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
        );

        // Refresh proposal data after successful vote
        window.location.reload();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Voting error:", error);
      let errorMessage = "Failed to submit vote";

      if (error.message.includes("Already voted")) {
        errorMessage = "You have already voted on this proposal";
      } else if (error.message.includes("Proposal is not active")) {
        errorMessage = "This proposal is no longer active";
      } else if (error.message.includes("Voting period has ended")) {
        errorMessage = "The voting period has ended";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error, please try again";
      } else if (error.message.includes("user rejected")) {
        errorMessage = "Transaction rejected";
      } else if (error.message.includes("chain ID")) {
        errorMessage = "Please switch to Base Sepolia network";
      } else if (error.message.includes("Only fund escrow can deploy")) {
        errorMessage = "Only DAO members can vote on proposals";
      }

      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsVoting(false);
      setIsVoteModalOpen(false);
      setCurrentVoteType(null);
    }
  }, [isConnected, userAddress, currentVoteType, proposal.id, isUserDaoMember]);

  // Helper function to encode the vote function call
  function encodeVoteFunction(proposalId, support) {
    // Find the vote function in the ABI
    const voteFunction = daoABI.find(
      item => item.type === "function" && item.name === "vote"
    );
    
    if (!voteFunction) {
      throw new Error("Vote function not found in ABI");
    }
    
    // Create function signature
    const functionSignature = `vote(uint256,bool)`;
    
    // Create function selector (first 4 bytes of the keccak256 hash of the function signature)
    const selector = window.ethereum.utils?.keccak256(functionSignature).slice(0, 10) || 
                    "0x0121b93f"; // Fallback to hardcoded selector if utils not available
    
    // Encode parameters
    // Convert proposalId to hex and pad to 32 bytes
    const encodedProposalId = BigInt(proposalId).toString(16).padStart(64, '0');
    
    // Encode boolean (0 for false, 1 for true) and pad to 32 bytes
    const encodedSupport = support ? "1".padStart(64, '0') : "0".padStart(64, '0');
    
    // Combine selector and encoded parameters
    return `${selector}${encodedProposalId}${encodedSupport}`;
  }

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
            <p className="mb-4 text-gray-600">Please connect your wallet using the button in the navbar to vote on this proposal.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Connected: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : ""}
              </span>
              {isUserDaoMember && (
                <span className="text-sm text-green-600 font-medium">DAO Member</span>
              )}
            </div>

            {/* Voting Requirements */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Voting Requirements</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Total DAO Members: <span className="font-medium">{totalMembers}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Required Votes to Pass: <span className="font-medium">{requiredVotes} (60%)</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current For Votes: <span className="font-medium">{proposal.forVotes}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Against Votes: <span className="font-medium">{proposal.againstVotes}</span>
                </p>
              </div>
            </div>

            {/* Approval Status */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Approval Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${approvalStatus.color}`}
                >
                  {approvalStatus.status}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{votePercentage}% Approval</span>
                <span>60% Required</span>
              </div>
            </div>

            {/* Vote Counts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{proposal.forVotes}</div>
                <div className="text-sm text-gray-600">For</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{proposal.againstVotes}</div>
                <div className="text-sm text-gray-600">Against</div>
              </div>
            </div>

            {/* Voting Actions */}
            {proposal.state === "Active" && (
              <div>
                {hasUserVoted ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">You have already voted on this proposal</p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote("for")}
                      disabled={isVoting}
                      className={`flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                        isVoting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                      }`}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      Vote For
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote("against")}
                      disabled={isVoting}
                      className={`flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                        isVoting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
                      }`}
                    >
                      <ThumbsDown className="h-5 w-5" />
                      Vote Against
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {proposal.state !== "Active" && (
              <div
                className={`rounded-lg p-4 text-center ${
                  proposal.state === "Passed" || proposal.state === "Executed"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {proposal.state === "Passed" || proposal.state === "Executed" ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                )}
                <p className="text-gray-700">
                  This proposal has been{" "}
                  <span
                    className={
                      proposal.state === "Passed" || proposal.state === "Executed"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {proposal.state.toLowerCase()}
                  </span>
                </p>
                {proposal.state === "Passed" && (
                  <p className="text-sm text-green-600 mt-2">
                    A new DisasterRelief contract has been deployed!
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Vote Confirmation Modal */}
      {isVoteModalOpen && (
        <ProposalVoteModal
          onClose={() => {
            setIsVoteModalOpen(false);
            setCurrentVoteType(null);
          }}
          onConfirm={onVote}
          proposal={proposal}
          voteType={currentVoteType}
          isLoading={isVoting}
        />
      )}
    </motion.div>
  );
};

// Simple ProposalVoteModal component
const ProposalVoteModal = ({ onClose, onConfirm, proposal, voteType, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Confirm Your Vote</h3>
        <p className="mb-6">
          You are voting <span className={voteType === "for" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {voteType === "for" ? "FOR" : "AGAINST"}
          </span> the proposal:
          <br />
          <span className="font-medium">{proposal.title || "Proposal #" + proposal.id}</span>
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
  );
};

export default ProposalVotingCard;