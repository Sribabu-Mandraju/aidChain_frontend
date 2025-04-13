import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatAddress,
  formatCurrency,
  calculateTimeLeft,
  formatDate,
} from "../../../utils/dao_helper";

const ProposalModal = ({ proposal, onClose, onVote }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [voteType, setVoteType] = useState(null);
  const timeLeft = calculateTimeLeft(proposal.endTime);
  const totalVotes = proposal.forVotes + proposal.againstVotes;
  const forPercentage =
    totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;

  const handleVote = (type) => {
    setVoteType(type);
    setIsVoting(true);
  };

  const confirmVote = () => {
    onVote(proposal.id, voteType);
    setIsVoting(false);
    // In a real app, you would wait for transaction confirmation
  };

  const cancelVote = () => {
    setIsVoting(false);
    setVoteType(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0  opacity-75" onClick={onClose}></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            {/* Modal Header with Image */}
            <div className="relative h-48">
              <img
                src={proposal.image || "/placeholder.svg"}
                alt={proposal.disasterName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${
                      proposal.state === "Active"
                        ? "bg-green-500"
                        : proposal.state === "Urgent"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {proposal.state}
                  </span>
                  <span className="text-sm">Proposal #{proposal.id}</span>
                </div>
                <h3 className="text-xl font-bold">{proposal.disasterName}</h3>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!isVoting ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{proposal.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Proposer</p>
                      <p className="font-medium">
                        {formatAddress(proposal.proposer)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Funds Requested</p>
                      <p className="font-medium">
                        {formatCurrency(proposal.fundsRequested)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{proposal.duration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {formatDate(proposal.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">
                        {formatDate(proposal.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-green-600">
                        {proposal.forVotes} For
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {proposal.againstVotes} Against
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${forPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalVotes} total votes •{" "}
                      {proposal.state === "Completed" ? "Ended" : timeLeft}
                    </p>
                  </div>

                  {/* Voting Buttons */}
                  {proposal.state !== "Completed" && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleVote("for")}
                        className="flex-1 py-2 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-colors"
                      >
                        Vote For
                      </button>
                      <button
                        onClick={() => handleVote("against")}
                        className="flex-1 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        Vote Against
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <h4 className="text-lg font-semibold mb-4">
                    Confirm your vote: {voteType === "for" ? "For" : "Against"}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    You are about to cast your vote{" "}
                    {voteType === "for" ? "in support of" : "against"} this
                    proposal. This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={cancelVote}
                      className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmVote}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        voteType === "for"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Confirm Vote
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProposalModal;
