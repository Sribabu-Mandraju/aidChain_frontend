"use client"

import { motion } from "framer-motion"
import { useSelector } from "react-redux"

const DAOHeader = ({ onManageMembers, totalMembers }) => {
  const daoMembersList = useSelector((state) => state.daoMembers.members);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 sm:mb-16"
    >
      <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full mb-4">
        <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
        <span className="text-green-800 font-medium text-sm">DAO Governance</span>
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
        Disaster Relief{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Proposals</span>
      </h2>
      <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
        Vote on active proposals or create new ones to help communities in need. Your participation shapes our
        collective response to disasters worldwide.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onManageMembers}
          className="inline-flex items-center px-6 py-3 bg-white border border-green-500 text-green-600 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 shadow-sm"
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          Manage Members ({daoMembersList.length || 0})
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DAOHeader
