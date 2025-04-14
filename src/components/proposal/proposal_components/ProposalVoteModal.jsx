"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react"

const ProposalVoteModal = ({ onClose, onConfirm, proposal }) => {
  const [voteType, setVoteType] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!voteType) return

    setIsSubmitting(true)
    // In a real app, this would call a smart contract function
    setTimeout(() => {
      onConfirm(voteType)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-4 px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Cast Your Vote</h3>
                <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {proposal.disasterName} - Proposal #{proposal.id}
                </h4>
                <p className="text-gray-600">
                  Your vote will be recorded on the blockchain and cannot be changed once submitted.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={() => setVoteType("for")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    voteType === "for"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <ThumbsUp className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-800">Vote For</span>
                    <span className="text-sm text-gray-500 mt-1">Support this proposal</span>
                  </div>
                </button>

                <button
                  onClick={() => setVoteType("against")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    voteType === "against"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                      <ThumbsDown className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-800">Vote Against</span>
                    <span className="text-sm text-gray-500 mt-1">Oppose this proposal</span>
                  </div>
                </button>
              </div>

              {!voteType && (
                <div className="flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-lg mb-6">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">Please select your vote</span>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!voteType || isSubmitting}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    !voteType
                      ? "bg-gray-400 cursor-not-allowed"
                      : voteType === "for"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Vote"}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProposalVoteModal
