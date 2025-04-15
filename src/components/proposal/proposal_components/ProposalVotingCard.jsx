"use client"

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "react-hot-toast";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { vote, isDAOMember, getProposal, memberCount, hasVoted, executeProposal, isAdmin } from "../../../providers/dao_provider";

// Initialize public client for transaction receipt
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const ProposalVotingCard = ({ proposal, approvalStatus, votePercentage }) => {
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [currentVoteType, setCurrentVoteType] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [isUserDaoMember, setIsUserDaoMember] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [hasUserVotedState, setHasUserVotedState] = useState(false);
  const [totalMembers, setTotalMembers] = useState(0);
  const [requiredVotes, setRequiredVotes] = useState(0);
  const [currentProposal, setCurrentProposal] = useState(proposal);
  const { address: userAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Validate proposal prop
  if (!proposal || !proposal.id) {
    console.error("Invalid proposal data:", proposal);
    return <div className="text-red-600">Error: Invalid proposal data</div>;
  }

  // Calculate required votes (60% of total members)
  useEffect(() => {
    const calculateRequiredVotes = async () => {
      try {
        const total = await memberCount();
        const totalNum = Number(total) || 0;
        setTotalMembers(totalNum);
        const required = Math.ceil((60 * totalNum) / 100);
        setRequiredVotes(required);
      } catch (error) {
        console.error("Error calculating required votes:", error);
        toast.error("Failed to fetch DAO member count");
      }
    };

    calculateRequiredVotes();
  }, []);

  // Check DAO membership, admin status, and voting status
  useEffect(() => {
    const checkMembershipAndVote = async () => {
      if (!userAddress) {
        setIsUserDaoMember(false);
        setIsUserAdmin(false);
        setHasUserVotedState(false);
        return;
      }

      try {
        const [isMember, isAdminStatus, voted] = await Promise.all([
          isDAOMember(userAddress),
          isAdmin(userAddress),
          hasVoted(proposal.id, userAddress)
        ]);

        setIsUserDaoMember(isMember);
        setIsUserAdmin(isAdminStatus);
        setHasUserVotedState(voted);

        // Refresh proposal data
        const updatedProposal = await getProposal(proposal.id);
        setCurrentProposal(updatedProposal);
      } catch (error) {
        console.error("Error checking DAO status:", error);
        toast.error("Failed to verify DAO status");
        setIsUserDaoMember(false);
        setIsUserAdmin(false);
      }
    };

    checkMembershipAndVote();
  }, [userAddress, proposal.id]);

  // Check if proposal has reached 60% approval
  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (currentProposal.forVotes >= requiredVotes && currentProposal.state === 0) {
        try {
          const updatedProposal = await getProposal(proposal.id);
          if (updatedProposal.state === 0) {
            setCurrentProposal({ ...updatedProposal, state: 1 }); // Mark as Passed
          }
        } catch (error) {
          console.error("Error updating proposal status:", error);
        }
      }
    };

    checkApprovalStatus();
  }, [currentProposal.forVotes, requiredVotes, proposal.id]);

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

      if (hasUserVotedState) {
        toast.error("You have already voted on this proposal");
        return;
      }

      if (currentProposal.state !== 0) {
        toast.error("This proposal is no longer active for voting");
        return;
      }

      setCurrentVoteType(voteType);
      setIsVoteModalOpen(true);
    },
    [isConnected, userAddress, isUserDaoMember, hasUserVotedState, currentProposal.state]
  );

  // Handle vote submission
  const onVote = useCallback(async () => {
    if (!isConnected || !userAddress || !walletClient) {
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
      const result = await vote(proposal.id, currentVoteType === "for", walletClient);

      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash: result });

      if (receipt.status === "success") {
        toast.success(
          <div className="flex flex-col">
            <span>Vote submitted successfully!</span>
            <a
              href={`https://sepolia.basescan.org/tx/${result}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View transaction
            </a>
          </div>,
          { id: toastId, duration: 5000 }
        );

        // Refresh proposal data
        const updatedProposal = await getProposal(proposal.id);
        setCurrentProposal(updatedProposal);
        setHasUserVotedState(true);

        // Check if proposal has reached 60% approval
        if (updatedProposal.forVotes >= requiredVotes && updatedProposal.state === 0) {
          setCurrentProposal({ ...updatedProposal, state: 1 }); // Mark as Passed
        }
      } else {
        throw new Error("Transaction reverted");
      }
    } catch (error) {
      console.error("Voting error:", error);
      let errorMessage = error.message || "An unexpected error occurred";
      if (error.message.includes("Proposal is not active")) {
        errorMessage = "This proposal is no longer active for voting.";
      } else if (error.message.includes("Already voted")) {
        errorMessage = "You have already voted on this proposal.";
      } else if (error.message.includes("gas")) {
        errorMessage = "Gas estimation failed. Try again or contact support.";
      }
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsVoting(false);
      setIsVoteModalOpen(false);
      setCurrentVoteType(null);
    }
  }, [isConnected, userAddress, walletClient, currentVoteType, proposal.id, isUserDaoMember, requiredVotes]);

  // Handle proposal execution
  const handleExecute = useCallback(async () => {
    if (!isConnected || !userAddress || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isUserAdmin) {
      toast.error("Only admins or operators can execute proposals");
      return;
    }

    if (currentProposal.state !== 1) {
      toast.error("Proposal must be in Passed state to execute");
      return;
    }

    setIsExecuting(true);
    const toastId = toast.loading("Executing proposal...");

    try {
      const result = await executeProposal(proposal.id, walletClient);

      // Wait for transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash: result });

      if (receipt.status === "success") {
        toast.success(
          <div className="flex flex-col">
            <span>Proposal executed successfully!</span>
            <a
              href={`https://sepolia.basescan.org/tx/${result}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View transaction
            </a>
          </div>,
          { id: toastId, duration: 5000 }
        );

        // Update proposal state to Executed
        const updatedProposal = await getProposal(proposal.id);
        setCurrentProposal({ ...updatedProposal, state: 3 });
      } else {
        throw new Error("Transaction reverted");
      }
    } catch (error) {
      console.error("Execution error:", error);
      let errorMessage = error.message || "An unexpected error occurred";
      if (error.message.includes("Proposal is not passed")) {
        errorMessage = "Proposal must be passed before execution.";
      } else if (error.message.includes("Insufficient funds")) {
        errorMessage = "Not enough funds in the escrow to execute this proposal.";
      } else if (error.message.includes("gas")) {
        errorMessage = "Gas estimation failed. Try again or contact support.";
      }
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsExecuting(false);
      setIsExecuteModalOpen(false);
    }
  }, [isConnected, userAddress, walletClient, isUserAdmin, currentProposal.state, proposal.id]);

  // Calculate updated vote percentage
  const updatedVotePercentage = totalMembers > 0 
    ? Math.min((currentProposal.forVotes / totalMembers) * 100, 100)
    : 0;

  // Determine updated approval status
  const updatedApprovalStatus = {
    status: currentProposal.state === 0 
      ? currentProposal.forVotes >= requiredVotes ? "Passing" : "Pending"
      : currentProposal.state === 1 ? "Passed" 
      : currentProposal.state === 2 ? "Rejected" 
      : "Executed",
    color: currentProposal.state === 0 
      ? currentProposal.forVotes >= requiredVotes ? "bg-green-500" : "bg-yellow-500"
      : currentProposal.state === 1 ? "bg-green-500"
      : currentProposal.state === 2 ? "bg-red-500"
      : "bg-blue-500"
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
            <p className="mb-4 text-gray-600">Please connect your wallet using the button in the navbar to vote on this proposal.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Connected: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not connected"}
              </span>
              <div className="flex gap-2">
                {isUserDaoMember && (
                  <span className="text-sm text-green-600 font-medium">DAO Member</span>
                )}
                {isUserAdmin && (
                  <span className="text-sm text-blue-600 font-medium">Admin</span>
                )}
              </div>
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
                  Current For Votes: <span className="font-medium">{currentProposal.forVotes || 0}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Against Votes: <span className="font-medium">{currentProposal.againstVotes || 0}</span>
                </p>
              </div>
            </div>

            {/* Approval Status */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Approval Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${updatedApprovalStatus.color}`}>
                  {updatedApprovalStatus.status}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${updatedVotePercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{updatedVotePercentage.toFixed(1)}% Approval</span>
                <span>60% Required</span>
              </div>
            </div>

            {/* Vote Counts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{currentProposal.forVotes || 0}</div>
                <div className="text-sm text-gray-600">For</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{currentProposal.againstVotes || 0}</div>
                <div className="text-sm text-gray-600">Against</div>
              </div>
            </div>

            {/* Voting/Execution Actions */}
            {currentProposal.state === 0 ? (
              <div>
                {hasUserVotedState ? (
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
                      disabled={isVoting || !isUserDaoMember}
                      className={`flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                        isVoting || !isUserDaoMember
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
                      disabled={isVoting || !isUserDaoMember}
                      className={`flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
                        isVoting || !isUserDaoMember
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
            ) : (
              <div
                className={`rounded-lg p-4 text-center ${
                  currentProposal.state === 1 || currentProposal.state === 3
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {currentProposal.state === 1 || currentProposal.state === 3 ? (
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                )}
                <p className="text-gray-700">
                  This proposal has been{" "}
                  <span
                    className={
                      currentProposal.state === 1 || currentProposal.state === 3
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {["Active", "Passed", "Rejected", "Executed"][currentProposal.state]}
                  </span>
                </p>
                {currentProposal.state === 1 && isUserAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExecuteModalOpen(true)}
                    disabled={isExecuting}
                    className={`mt-4 py-2 px-4 rounded-lg font-semibold text-white ${
                      isExecuting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Execute Proposal
                  </motion.button>
                )}
                {currentProposal.state === 3 && (
                  <p className="text-sm text-green-600 mt-2">
                    DisasterRelief contract deployed!
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
          proposal={currentProposal}
          voteType={currentVoteType}
          isLoading={isVoting}
        />
      )}

      {/* Execute Confirmation Modal */}
      {isExecuteModalOpen && (
        <ExecuteProposalModal
          onClose={() => setIsExecuteModalOpen(false)}
          onConfirm={handleExecute}
          proposal={currentProposal}
          isLoading={isExecuting}
        />
      )}
    </motion.div>
  );
};

// Vote Confirmation Modal
const ProposalVoteModal = ({ onClose, onConfirm, proposal, voteType, isLoading }) => {
  return (
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
  );
};

// Execute Confirmation Modal
const ExecuteProposalModal = ({ onClose, onConfirm, proposal, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Execute Proposal</h3>
        <p className="mb-6">
          You are about to execute the proposal:
          <br />
          <span className="font-medium">{proposal.disasterName || `Proposal #${proposal.id}`}</span>
          <br />
          This will deploy a new DisasterRelief contract.
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
                Executing...
              </div>
            ) : (
              "Confirm Execution"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalVotingCard;