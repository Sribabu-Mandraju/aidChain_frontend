"use client"
import { formatCurrency } from "../../../utils/dao_helper"

const ProposalPreview = ({ proposal }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Preview Your Proposal</h3>
        <p className="text-gray-600">Review your proposal before submitting to the DAO</p>
      </div>

      <div className="space-y-6">
        {/* Header with Image */}
        <div className="relative h-64 rounded-xl overflow-hidden">
          <img
            src={proposal.image || "/placeholder.svg"}
            alt={proposal.disasterName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="inline-flex items-center px-3 py-1 bg-green-500 rounded-full mb-2">
              <span className="text-xs font-semibold">New Proposal</span>
            </div>
            <h2 className="text-2xl font-bold">{proposal.disasterName}</h2>
            <p className="text-sm opacity-90">{proposal.area}</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">{proposal.duration} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Funds Requested</p>
            <p className="font-medium">{formatCurrency(proposal.fundsRequested)}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Proposal Description</h3>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: proposal.description }} />
          </div>
        </div>

        {/* Voting Preview (Informational) */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Voting Process</h3>
          <p className="text-gray-600 mb-4">
            Once submitted, DAO members will be able to vote on your proposal. The voting period will last for the
            duration you specified.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">For</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Against</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-gray-400 h-2.5 rounded-full w-0"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">0 total votes • Voting will begin after submission</p>
        </div>
      </div>
    </div>
  )
}

export default ProposalPreview
