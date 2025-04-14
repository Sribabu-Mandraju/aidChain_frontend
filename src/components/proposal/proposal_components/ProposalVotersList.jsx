"use client"

import { ThumbsUp, ThumbsDown } from "lucide-react"
import { formatAddress, formatDate } from "../../../utils/dao_helper"

const ProposalVotersList = ({ voters, showAll }) => {
  if (!voters || voters.length === 0) {
    return <p className="text-gray-500 text-center py-4">No votes yet</p>
  }

  return (
    <div className="space-y-3">
      {voters.map((voter, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                voter.vote === "for" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {voter.vote === "for" ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-medium text-gray-800">{formatAddress(voter.address)}</p>
              <p className="text-xs text-gray-500">{formatDate(voter.timestamp)}</p>
            </div>
          </div>
          <span
            className={`text-xs font-medium ${voter.vote === "for" ? "text-green-600" : "text-red-600"} capitalize`}
          >
            {voter.vote}
          </span>
        </div>
      ))}

      {!showAll && voters.length > 3 && (
        <div className="text-center text-sm text-gray-500 pt-2">+ {voters.length - 3} more voters</div>
      )}
    </div>
  )
}

export default ProposalVotersList
