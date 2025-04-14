import { CheckCircle } from "lucide-react"

const ProposalEligibilityCriteria = ({ proposal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          Eligibility Criteria
        </h2>
        <p className="text-gray-600 mb-4">
          If this proposal is approved, the following criteria will determine who can register for aid:
        </p>
        <ul className="space-y-2">
          {proposal.eligibilityCriteria.map((criterion, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="ml-2 text-gray-700">{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProposalEligibilityCriteria 