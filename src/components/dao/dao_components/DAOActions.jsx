"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const DAOActions = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
    >
      <div className="flex flex-wrap gap-2">
        {/* Treasury button removed */}
      </div>

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Proposal
      </button>
    </motion.div>
  )
}

export default DAOActions
