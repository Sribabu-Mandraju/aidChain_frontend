"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProposalTable from "./dao_components/ProposalTable";
import ProposalModal from "./dao_components/ProposalModal";
import ProposalFilters from "./dao_components/ProposalFilters";
import MemberManagement from "./dao_components/MemberManagement";
import DAOStats from "./dao_components/DAOStats";
import DAOHeader from "./dao_components/DAOHeader";
import DAOActions from "./dao_components/DAOActions";
import { useNavigate } from "react-router-dom";
import { formatAddress } from "../../utils/dao_helper";
import { useSelector } from "react-redux";
import { getReadFundEscrowContract, getBalance } from "../../providers/fund_escrow_provider";
import { formatEther } from "viem";
import { getReadDaoContract } from "../../providers/dao_provider";


const DAO = () => {
  const navigate = useNavigate()
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [daoStats, setDaoStats] = useState([]);
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  const [totalMembers, setTotalMembers] = useState("0");
  const [activeProposals, setActiveProposals] = useState("0");
  const [totalFundsAllocated, setTotalFundsAllocated] = useState("0");
  const proposalsData = useSelector((state) => state.proposalsList.proposals)

  // Format balance for display (similar to DonateForm)
  const formatBalance = (balance) => {
    return (Number(balance) / 1000000).toFixed(2);
  };

  // Fetch treasury balance from the fund escrow contract
  useEffect(() => {
    const fetchTreasuryBalance = async () => {
      try {
        console.log("Fetching treasury balance...");
        const balance = await getBalance();
        console.log("Raw treasury balance:", balance);
        setTreasuryBalance(balance);
      } catch (error) {
        console.error("Error fetching treasury balance:", error);
        setTreasuryBalance("0");
      }
    };

    fetchTreasuryBalance();
  }, []);

  // Fetch DAO stats
  useEffect(() => {
    const fetchDaoStats = async () => {
      try {
        const { publicClient, address, abi } = getReadDaoContract();
        
        // Get total members
        const members = await publicClient.readContract({
          address,
          abi,
          functionName: "memberCount",
        });
        setTotalMembers(members.toString());

        // Get total proposals
        const proposals = await publicClient.readContract({
          address,
          abi,
          functionName: "proposalCount",
        });
        setActiveProposals(proposals.toString());

        // Calculate total funds allocated from proposals
        if (proposalsData && proposalsData.length > 0) {
          const total = proposalsData.reduce((sum, proposal) => {
            return sum + Number(proposal.fundsRequested);
          }, 0);
          setTotalFundsAllocated(total.toFixed(2));
        }
      } catch (error) {
        console.error("Error fetching DAO stats:", error);
      }
    };

    fetchDaoStats();
  }, [proposalsData]);

  // Function to calculate total passed requested funds
  const calculatePassedRequestedFunds = (proposals) => {
    const totalFunds = proposals
      .filter(proposal => proposal.state === "Passed")
      .reduce((sum, proposal) => {
        return sum + proposal.fundsRequested;
      }, 0);

    return totalFunds * 1e12;
  };

  // Update DAO stats whenever the values change
  useEffect(() => {
    const totalPassedFunds = calculatePassedRequestedFunds(proposalsData || []);

    const mockStats = [
      {
        label: "Total Members",
        value: totalMembers,
        icon: (
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        ),
        bgColor: "bg-blue-100",
      },
      {
        label: "Total Proposals",
        value: activeProposals,
        icon: (
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        ),
        bgColor: "bg-green-100",
      },
      {
        label: "Treasury Balance",
        value: `$${treasuryBalance ? formatBalance(treasuryBalance) : '0.00'} USDC`,
        icon: (
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        ),
        bgColor: "bg-yellow-100",
      },
      {
        label: "Total Passed Funds",
        value: `$${totalPassedFunds} USDC`,
        icon: (
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        ),
        bgColor: "bg-purple-100",
      },
    ];

    setDaoStats(mockStats);
  }, [totalMembers, activeProposals, treasuryBalance, proposalsData]);

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

  const handleOpenProposalModal = (proposal) => {
    navigate(`/proposals/${proposal.id}`)
    // setSelectedProposal(proposal);
    // setIsProposalModalOpen(true);
  };

  const handleCloseProposalModal = () => {
    setIsProposalModalOpen(false);
    setSelectedProposal(null);
  };

  const handleOpenMemberModal = () => {
    setIsMemberModalOpen(true);
  };

  const handleCloseMemberModal = () => {
    setIsMemberModalOpen(false);
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

  const handleAddMember = (address) => {
    // In a real app, this would call a smart contract function
    const newMember = {
      address,
      joinedAt: Date.now(),
      proposalsCreated: 0,
      votesParticipated: 0,
    };

    setMembers((prevMembers) => [...prevMembers, newMember]);

    // Update stats
    setDaoStats((prevStats) =>
      prevStats.map((stat) =>
        stat.label === "Total Members"
          ? { ...stat, value: stat.value + 1 }
          : stat
      )
    );
  };

  const handleRemoveMember = (address) => {
    // In a real app, this would call a smart contract function
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.address !== address)
    );

    // Update stats
    setDaoStats((prevStats) =>
      prevStats.map((stat) =>
        stat.label === "Total Members"
          ? { ...stat, value: stat.value - 1 }
          : stat
      )
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
        <DAOHeader
          onManageMembers={handleOpenMemberModal}
          totalMembers={members.length}
        />

        {/* DAO Stats */}
        <DAOStats stats={daoStats} />

        {/* Action Buttons */}
        <DAOActions />

        {/* Filters */}
        {/* <ProposalFilters
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        /> */}

        {/* Proposals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ProposalTable
            proposals={filteredProposals}
            onViewDetails={handleOpenProposalModal}
          />
        </motion.div>

        {/* Proposal Details Modal */}
        <AnimatePresence>
          {isProposalModalOpen && selectedProposal && (
            <ProposalModal
              proposal={selectedProposal}
              onClose={handleCloseProposalModal}
              onVote={handleVote}
            />
          )}
        </AnimatePresence>

        {/* Member Management Modal */}
        <AnimatePresence>
          {isMemberModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block align-bottom sm:align-middle sm:max-w-2xl sm:w-full"
                >
                  <MemberManagement
                    onClose={handleCloseMemberModal}
                    currentMembers={members}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DAO;
