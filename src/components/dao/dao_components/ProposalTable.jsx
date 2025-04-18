import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ProposalCard from "./ProposalCard";
import {
  formatAddress,
  formatCurrency,
  calculateTimeLeft,
} from "../../../utils/dao_helper";
import { fetchProposals, selectProposals, selectProposalsLoading, selectProposalsError, selectProposalsLastFetchTime } from '../../../store/slices/proposalsListSlice';

const ProposalTable = ({ onViewDetails }) => {
  const dispatch = useDispatch();
  const proposals = useSelector(selectProposals);
  const loading = useSelector(selectProposalsLoading);
  const error = useSelector(selectProposalsError);
  const lastFetchTime = useSelector(selectProposalsLastFetchTime);
  const [stateFilter, setStateFilter] = useState('all');

  // Fetch proposals only if they don't exist in Redux
  useEffect(() => {
    if (!proposals.length && !loading) {
      dispatch(fetchProposals());
    }
  }, [dispatch, proposals.length, loading]);

  const handleRefresh = async () => {
    try {
      await dispatch(fetchProposals()).unwrap();
      toast.success('Proposals refreshed successfully!');
    } catch (error) {
      toast.error(`Failed to refresh proposals: ${error}`);
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    if (stateFilter === 'all') return true;
    return proposal.state === stateFilter;
  });

  if (loading && !proposals.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredProposals.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">
          No proposals found matching your criteria.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Refresh
        </button>
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">Proposals</h2>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All States</option>
            <option value="Active">Active</option>
            <option value="Passed">Passed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

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
            {filteredProposals.map((proposal) => {
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
        {filteredProposals.map((proposal, index) => (
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