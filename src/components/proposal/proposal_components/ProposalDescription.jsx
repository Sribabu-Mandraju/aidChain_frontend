import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { formatAddress, formatCurrency, formatDate } from "../../../utils/dao_helper"
import { useState } from "react"

const ProposalDescription = ({ proposal }) => {
  const [description, setDescription] = useState(proposal.description)
  const [isLoading, setIsLoading] = useState(false)
  const [isElaborated, setIsElaborated] = useState(false)

  const formatElaboratedDescription = (data) => {
    // First, let's properly parse the response
    const sections = {
      whatHappened: {
        title: "What happened",
        content: data.summary.match(/\*\*What happened\*\*: (.*?)(?=\*\*|$)/s)?.[1]?.trim() || ""
      },
      whoAffected: {
        title: "Who is affected",
        content: data.summary.match(/\*\*Who is affected\*\*: (.*?)(?=\*\*|$)/s)?.[1]?.trim() || ""
      },
      helpRequired: {
        title: "Help required",
        content: data.summary.match(/\*\*Help required\*\*: (.*?)(?=\*\*|$)/s)?.[1]?.trim() || ""
      }
    };

    console.log("Parsed sections:", sections); // For debugging

    return (
      <div className="space-y-6 bg-white rounded-lg">
        {/* What Happened Section */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {sections.whatHappened.title}
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {sections.whatHappened.content}
            </p>
          </div>
        </div>

        {/* Who is affected Section */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {sections.whoAffected.title}
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {sections.whoAffected.content}
            </p>
          </div>
        </div>

        {/* Help required Section */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {sections.helpRequired.title}
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {sections.helpRequired.content}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleElaborate = async () => {
    if (isElaborated) {
      setDescription(proposal.description)
      setIsElaborated(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://disaster-summary-3.onrender.com/get_disaster_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "Gujarat Firecracker Warehouse Explosion"
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch elaboration');
      }

      const data = await response.json()
      console.log("API Response:", data); // For debugging
      setDescription(formatElaboratedDescription(data))
      setIsElaborated(true)
    } catch (error) {
      console.error('Error elaborating description:', error)
      setDescription(
        <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>Failed to elaborate description. Please try again later.</p>
        </div>
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">About This Proposal</h2>
        <button
          onClick={handleElaborate}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-green-300 transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            isElaborated ? 'Show Original' : 'Elaborate'
          )}
        </button>
      </div>
      
      <div className="description-container">
        {typeof description === 'string' ? (
          <p className="text-gray-600">{description}</p>
        ) : (
          description
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start">
          <DollarSign className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Funds Requested</p>
            <p className="font-semibold">${proposal.fundsRequested*1e12}</p>
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