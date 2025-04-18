import { motion } from "framer-motion";
import {
  formatAddress,
  formatCurrency,
  calculateTimeLeft,
} from "../../../utils/dao_helper";

const ProposalCard = ({ proposal, onViewDetails, index }) => {
  const timeLeft = calculateTimeLeft(proposal.endTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden"
    >
      <div className="relative h-32 bg-gradient-to-r from-green-500 to-emerald-600">
        <img
          src={proposal.image || "/placeholder.svg"}
          alt={proposal.disasterName}
          className="w-full h-full object-cover "
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              proposal.state === "Active"
                ? "bg-green-100 text-green-800"
                : proposal.state === "Urgent"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {proposal.state}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {proposal.disasterName}
          </h3>
          <span className="text-sm text-gray-500">#{proposal.id}</span>
        </div>

        <p className="text-sm text-gray-600 mb-3">{proposal.area}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">Proposer</p>
            <p className="text-sm font-medium">
              {formatAddress(proposal.proposer)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Funds Requested</p>
            <p className="text-sm font-medium">
              {formatCurrency(proposal.fundsRequested)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Time Left</p>
            <p className="text-sm font-medium">
              {proposal.state === "Completed" ? "Ended" : timeLeft}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Votes (For/Against)</p>
            <p className="text-sm font-medium">
              <span className="text-green-600">{proposal.forVotes}</span>
              {" / "}
              <span className="text-red-600">{proposal.againstVotes}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(proposal)}
          className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ProposalCard;
