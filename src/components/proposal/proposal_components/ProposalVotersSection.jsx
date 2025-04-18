import ProposalVotersList from "./ProposalVotersList"

const ProposalVotersSection = ({ voters, showAllVoters, setShowAllVoters }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Voters</h2>
          <button
            onClick={() => setShowAllVoters(!showAllVoters)}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showAllVoters ? "Show Less" : "View All"}
          </button>
        </div>

        {/* <ProposalVotersList voters={showAllVoters ? voters : voters.slice(0, 3)} showAll={showAllVoters} /> */}
      </div>
    </div>
  )
}

export default ProposalVotersSection 