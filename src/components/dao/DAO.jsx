import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProposalTable from "./dao_components/ProposalTable";
import ProposalModal from "./dao_components/ProposalModal";
import ProposalFilters from "./dao_components/ProposalFilters";
import { formatAddress } from "../../utils/dao_helper";

const DAO = () => {
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from your blockchain connection
  useEffect(() => {
    const mockProposals = [
      {
        id: 1,
        proposer: "0x1234567890123456789012345678901234567890",
        disasterName: "Hurricane Relief Fund",
        area: "Caribbean Islands",
        duration: 15, // days
        fundsRequested: 200000,
        startTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        endTime: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
        forVotes: 125,
        againstVotes: 15,
        image:
          "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        state: "Active",
      },
      {
        id: 2,
        proposer: "0x2345678901234567890123456789012345678901",
        disasterName: "Earthquake Recovery Initiative",
        area: "Southeast Asia",
        duration: 30, // days
        fundsRequested: 150000,
        startTime: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        endTime: Date.now() + 27 * 24 * 60 * 60 * 1000, // 27 days from now
        forVotes: 89,
        againstVotes: 12,
        image:
          "https://images.unsplash.com/photo-1610550603158-91f50474b235?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        state: "Urgent",
      },
      {
        id: 3,
        proposer: "0x3456789012345678901234567890123456789012",
        disasterName: "Flood Relief Campaign",
        area: "Western Europe",
        duration: 21, // days
        fundsRequested: 100000,
        startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        endTime: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
        forVotes: 47,
        againstVotes: 8,
        image:
          "https://images.unsplash.com/photo-1595854341625-fc2528d3b11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        state: "Active",
      },
      {
        id: 4,
        proposer: "0x4567890123456789012345678901234567890123",
        disasterName: "Wildfire Support Network",
        area: "North America",
        duration: 45, // days
        fundsRequested: 80000,
        startTime: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
        endTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago (completed)
        forVotes: 63,
        againstVotes: 5,
        image:
          "https://images.unsplash.com/photo-1500994340878-40ce894df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        state: "Completed",
      },
      {
        id: 5,
        proposer: "0x5678901234567890123456789012345678901234",
        disasterName: "Drought Relief Program",
        area: "East Africa",
        duration: 60, // days
        fundsRequested: 250000,
        startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        endTime: Date.now() + 50 * 24 * 60 * 60 * 1000, // 50 days from now
        forVotes: 112,
        againstVotes: 23,
        image:
          "https://images.unsplash.com/photo-1594367031514-3aee0295ec98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        state: "Active",
      },
    ];

    setProposals(mockProposals);
    setFilteredProposals(mockProposals);
  }, []);

  // Filter proposals based on state and search term
  useEffect(() => {
    let result = [...proposals];

    // Apply state filter
    if (filter !== "All") {
      result = result.filter((proposal) => proposal.state === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (proposal) =>
          proposal.disasterName.toLowerCase().includes(term) ||
          proposal.area.toLowerCase().includes(term) ||
          formatAddress(proposal.proposer).toLowerCase().includes(term)
      );
    }

    setFilteredProposals(result);
  }, [filter, searchTerm, proposals]);

  const handleOpenModal = (proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const handleVote = (proposalId, voteType) => {
    // In a real app, this would call a smart contract function
    setProposals((prevProposals) =>
      prevProposals.map((proposal) => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            forVotes:
              voteType === "for" ? proposal.forVotes + 1 : proposal.forVotes,
            againstVotes:
              voteType === "against"
                ? proposal.againstVotes + 1
                : proposal.againstVotes,
          };
        }
        return proposal;
      })
    );
  };

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-white to-green-50 overflow-hidden min-h-screen">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full mb-4">
            <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            <span className="text-green-800 font-medium text-sm">
              DAO Governance
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Disaster Relief{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Proposals
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Vote on active proposals or create new ones to help communities in
            need. Your participation shapes our collective response to disasters
            worldwide.
          </p>
        </motion.div>

        {/* New Proposal Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-end mb-6"
        >
          <button
            onClick={() => navigate("/dao/new-proposal")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            New Proposal
          </button>
        </motion.div>

        {/* Filters */}
        <ProposalFilters
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Proposals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ProposalTable
            proposals={filteredProposals}
            onViewDetails={handleOpenModal}
          />
        </motion.div>

        {/* Proposal Details Modal */}
        {isModalOpen && selectedProposal && (
          <ProposalModal
            proposal={selectedProposal}
            onClose={handleCloseModal}
            onVote={handleVote}
          />
        )}
      </div>
    </section>
  );
};

export default DAO;
