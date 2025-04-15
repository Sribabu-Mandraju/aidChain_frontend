import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { formatAddress, formatCurrency, formatDate } from "../../../utils/dao_helper"

const ProposalDescription = ({ proposal }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Proposal</h2>
      <p className="text-gray-600">{proposal.description}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start">
          <DollarSign className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Funds Requested</p>
            <p className="font-semibold">{formatCurrency(proposal.fundsRequested)}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Users className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Proposer</p>
            <p className="font-semibold">{formatAddress(proposal.proposer)}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Calendar className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Proposal Date</p>
            <p className="font-semibold">{formatDate(proposal.startTime)}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Voting Ends</p>
            <p className="font-semibold">{formatDate(proposal.endTime)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalDescription 