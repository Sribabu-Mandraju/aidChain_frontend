"use client"
import { motion } from "framer-motion"

const InfoModal = ({ isDarkMode, setIsInfoModalOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 ${isDarkMode ? "bg-gray-900/70" : "bg-black/50"} flex items-center justify-center z-50 p-4`}
      onClick={() => setIsInfoModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-2xl p-6 sm:p-8 max-w-md w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">About ZK Aadhar Verification</h3>
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="space-y-4 text-gray-400">
          <p>
            This system uses Zero-Knowledge proofs to verify your Aadhar identity without revealing your actual Aadhar
            number to the blockchain or any third parties.
          </p>
          <p>When you submit your Aadhar, we generate a cryptographic proof that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Confirms you are the legitimate owner of a valid Aadhar</li>
            <li>Creates a unique nullifier that prevents double-claiming without revealing your identity</li>
            <li>Connects this verification to your wallet address for aid distribution</li>
          </ul>
          <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mt-4`}>
            Your privacy and security are our top priorities. No sensitive data is stored on the blockchain.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InfoModal
