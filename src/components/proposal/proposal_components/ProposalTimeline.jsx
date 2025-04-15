import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { formatDate } from "../../../utils/dao_helper"

const ProposalTimeline = ({ proposal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 text-green-500 mr-2" />
          Timeline
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-8">
            <div className="relative flex items-start">
              <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-green-100 rounded-full z-10 text-green-600">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="ml-4 pt-2">
                <h3 className="text-lg font-medium text-gray-900">Proposal Period</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDate(proposal.startTime)} - {formatDate(proposal.endTime)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  DAO members vote on whether to approve this proposal
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Duration: {Math.round((proposal.endTime - proposal.startTime) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-blue-100 rounded-full z-10 text-blue-600">
                <Users className="h-8 w-8" />
              </div>
              <div className="ml-4 pt-2">
                <h3 className="text-lg font-medium text-gray-900">Registration Period</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDate(proposal.registrationPeriod.start)} -{" "}
                  {formatDate(proposal.registrationPeriod.end)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  If approved, affected individuals can register for aid
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Duration: {((proposal.registrationPeriod.end - proposal.registrationPeriod.start) / (1000 * 60 * 60 * 24)).toFixed(2)} days
                </p>
              </div>
            </div>

            <div className="relative flex items-start">
              <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-yellow-100 rounded-full z-10 text-yellow-600">
                <DollarSign className="h-8 w-8" />
              </div>
              <div className="ml-4 pt-2">
                <h3 className="text-lg font-medium text-gray-900">Claiming Period</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDate(proposal.claimingPeriod.start)} - {formatDate(proposal.claimingPeriod.end)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Verified registrants can claim their allocated funds
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Duration: {Math.round((proposal.claimingPeriod.end - proposal.claimingPeriod.start) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalTimeline 