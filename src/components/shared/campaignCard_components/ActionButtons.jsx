import { motion } from "framer-motion"
import { Heart, UserPlus, Coins, Loader2, CheckCircle } from "lucide-react"

const ActionButtons = ({ 
  currentState, 
  timeLeft, 
  onDonate, 
  onRegister, 
  onClaim,
  isClaiming 
}) => {
  if (!currentState && currentState !== 0) return null

  return (
    <div className="space-y-4 mt-6">
      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Donate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDonate}
          className="group relative px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            <Heart size={18} />
            Donate
          </div>
        </motion.button>

        {/* Register Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRegister}
          className="group relative px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Register
          </div>
        </motion.button>

        {/* Claim Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClaim}
          disabled={isClaiming}
          className={`group relative px-4 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden ${
            isClaiming
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-violet-600"
          }`}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            {isClaiming ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Coins size={18} />
                Claim
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Status Message */}
      {currentState === 2 && (
        <div className="w-full px-4 py-3 text-sm text-center text-gray-600 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          Campaign is in waiting period
        </div>
      )}
      {currentState === 4 && (
        <div className="w-full px-4 py-3 text-sm text-center text-gray-600 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          Campaign has ended
        </div>
      )}
    </div>
  )
}

export default ActionButtons 