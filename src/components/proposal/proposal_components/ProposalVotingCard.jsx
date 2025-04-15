import { CheckCircle, XCircle, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react"
import ProposalVoteModal from "./ProposalVoteModal"

const ProposalVotingCard = ({
  proposal,
  isUserDaoMember,
  hasUserVoted,
  userAddress,
  isVoteModalOpen,
  setIsVoteModalOpen,
  currentVoteType,
  setCurrentVoteType,
  onVote,
  approvalStatus,
  votePercentage,
}) => {
  const handleVote = (voteType) => {
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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Proposal Voting</h2>

        {/* Approval Status */}
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
            {isUserDaoMember ? (
              hasUserVoted ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">You have already voted on this proposal</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVote("for")}
                    className="flex-1 py-3 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
                  >
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote("against")}
                    className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <ThumbsDown className="h-5 w-5 mr-2" />
                    Vote Against
                  </button>
                </div>
              )
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-700">Only DAO members can vote on proposals</p>
                <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                  Learn how to join
                </button>
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
          </div>
        )}
      </div>

      {/* Vote Confirmation Modal */}
      {isVoteModalOpen && (
        <ProposalVoteModal
          onClose={() => setIsVoteModalOpen(false)}
          onConfirm={onVote}
          proposal={proposal}
          voteType={currentVoteType}
        />
      )}
    </div>
  )
}

export default ProposalVotingCard 