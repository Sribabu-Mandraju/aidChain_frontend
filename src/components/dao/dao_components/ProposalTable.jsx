import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { toast, Toaster } from 'react-hot-toast';
import ProposalCard from "./ProposalCard";
import {
  formatAddress,
  formatCurrency,
  calculateTimeLeft,
} from "../../../utils/dao_helper";
import { getReadDaoContract } from '../../../providers/dao_provider';

const ProposalTable = ({ onViewDetails }) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      const toastId = toast.loading('Fetching proposals...');

      try {
        const contract = await getReadDaoContract();
        if (!contract || !contract.publicClient) {
          throw new Error("DAO contract or public client not available");
        }

        // Get total proposal count
        const proposalCount = await contract.publicClient.readContract({
          ...contract,
          functionName: 'proposalCount',
          args: [],
        });

        const fetchedProposals = [];

        // Fetch each proposal from 1 to proposalCount
        for (let id = 1; id <= Number(proposalCount); id++) {
          try {
            const proposal = await contract.publicClient.readContract({
              ...contract,
              functionName: 'getProposal',
              args: [BigInt(id)],
            });

            // Format proposal data
            const formattedProposal = {
              id: Number(proposal.id),
              proposer: proposal.proposer,
              disasterName: proposal.disasterName,
              area: `${proposal.location.latitude}, ${proposal.location.longitude} (Radius: ${proposal.location.radius})`,
              fundsRequested: Number(proposal.fundsRequested) / 1e18, // Convert wei to ETH
              forVotes: Number(proposal.forVotes),
              againstVotes: Number(proposal.againstVotes),
              startTime: Number(proposal.startTime),
              endTime: Number(proposal.endTime),
              image: proposal.image,
              state: proposal.state === 0 ? 'Active' : 
                     proposal.state === 1 ? 'Passed' : 
                     proposal.state === 2 ? 'Rejected' : 'Unknown'
            };

            fetchedProposals.push(formattedProposal);
          } catch (error) {
            console.warn(`Failed to fetch proposal ID ${id}:`, error);
            // Skip invalid proposals silently
            continue;
          }
        }

        setProposals(fetchedProposals);
        toast.success('Proposals fetched successfully!', { id: toastId });

      } catch (error) {
        console.error("Error fetching proposals:", error);
        const errorMessage = error?.shortMessage || error?.message || 'An unknown error occurred';
        toast.error(`Failed to fetch proposals: ${errorMessage}`, { id: toastId });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">Loading proposals...</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">
          No proposals found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
          },
        }}
      />

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Disaster
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Area
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Proposer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Funds Requested
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Time Left
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Votes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal) => {
              const timeLeft = calculateTimeLeft(proposal.endTime);

              return (
                <motion.tr
                  key={proposal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{proposal.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proposal.disasterName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proposal.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatAddress(proposal.proposer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(proposal.fundsRequested)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proposal.state === "Passed" || proposal.state === "Rejected" ? "Ended" : timeLeft}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        proposal.state === "Active"
                          ? "bg-green-100 text-green-800"
                          : proposal.state === "Passed"
                          ? "bg-blue-100 text-blue-800"
                          : proposal.state === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {proposal.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600">
                        {proposal.forVotes}
                      </span>
                      <span>/</span>
                      <span className="text-red-600">
                        {proposal.againstVotes}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(proposal)}
                      className="text-emerald-600 hover:text-emerald-900 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {proposals.map((proposal, index) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onViewDetails={onViewDetails}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default ProposalTable;