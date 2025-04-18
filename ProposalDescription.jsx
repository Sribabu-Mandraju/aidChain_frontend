import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { formatAddress, formatCurrency, formatDate } from "../../../utils/dao_helper"
import { useState } from "react"

const ProposalDescription = ({ proposal }) => {
  const [description, setDescription] = useState(proposal.description)
  const [isLoading, setIsLoading] = useState(false)
  const [isElaborated, setIsElaborated] = useState(false)

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
          query: proposal.description
        })
      })
      
      const data = await response.json()
      setDescription(data.summary || data) // Depending on API response structure
      setIsElaborated(true)
    } catch (error) {
      console.error('Error elaborating description:', error)
      // Optionally show error message to user
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
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-green-300"
        >
          {isLoading ? 'Processing...' : isElaborated ? 'Show Original' : 'Elaborate'}
        </button>Who
      </div>
      
      <p className="text-gray-600">{description}</p>

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