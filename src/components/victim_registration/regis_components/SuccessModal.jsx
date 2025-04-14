"use client"
import { motion } from "framer-motion"

const SuccessModal = ({ isDarkMode, setShowSuccessModal, walletAddress, nullifier, location }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 ${isDarkMode ? "bg-gray-900/70" : "bg-black/50"} flex items-center justify-center z-50 p-4`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-2xl p-6 sm:p-8 max-w-md w-full text-center`}
      >
        <div
          className={`w-20 h-20 ${isDarkMode ? "bg-green-900" : "bg-green-100"} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Registration Successful!
        </h2>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-2 mb-6`}>
          Your registration has been completed successfully. You will receive aid directly to your wallet once approved.
        </p>

        <div
          className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-6 ${isDarkMode ? "border-gray-600" : "border-gray-200"} border mb-6 text-left`}
        >
          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>Registration Summary</h3>
          <div className="space-y-3">
            <div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Wallet Address:</p>
              <p className={`text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"} break-all`}>
                {walletAddress}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nullifier:</p>
              <p className={`text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"} break-all`}>
                {nullifier}
              </p>
            </div>
            {location && (
              <div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location:</p>
                <p className={`text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowSuccessModal(false)}
          className={`w-full py-3 px-4 rounded-lg ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300"
          } font-medium`}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

export default SuccessModal
