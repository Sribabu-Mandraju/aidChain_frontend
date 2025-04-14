import { motion } from "framer-motion"
import ProposalStatusBadge from "./ProposalStatusBadge"

const ProposalHeader = ({ proposal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-64 sm:h-80">
        <img
          src={proposal.image || "/placeholder.svg"}
          alt={proposal.disasterName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <ProposalStatusBadge state={proposal.state} />
            <span className="text-sm opacity-80">Proposal #{proposal.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{proposal.disasterName}</h1>
          <p className="text-sm sm:text-base opacity-90 mt-1">{proposal.area}</p>
        </div>
      </div>
    </div>
  )
}

export default ProposalHeader 