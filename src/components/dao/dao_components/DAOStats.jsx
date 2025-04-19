"use client"

import { motion } from "framer-motion"
import { useSelector } from "react-redux"

const DAOStats = ({ stats }) => {
  const daoMembersList = useSelector((state) => state.daoMembers.members);
  const proposalsList = useSelector((state) => state.proposalsList.proposals);


  const sumPassedRequestedFunds = (proposals) => {
    // Filter proposals with "Passed" status and sum their fundsRequested values
    const totalFunds = proposals
      .filter(proposal => proposal.state === "Passed")
      .reduce((sum, proposal) => {
        return sum + proposal.fundsRequested;
      }, 0);
  
    // Multiply by 1e12 to get the actual value
    return totalFunds * 1e12;
  };

  console.log(proposalsList);
  console.log(daoMembersList);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor} mr-4`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change && (
                <div className={`flex items-center text-xs ${stat.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {stat.change > 0 ? (
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  )}
                  {Math.abs(stat.change)}% from last month
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default DAOStats
