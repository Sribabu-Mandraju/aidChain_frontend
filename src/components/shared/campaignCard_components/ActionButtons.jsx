import { motion } from "framer-motion"
import { Heart, UserPlus, Loader2, Coins, CheckCircle } from "lucide-react"

const ActionButtons = ({ 
  currentState, 
  timeLeft, 
  onDonate, 
  onRegister, 
  onClaim,
  isClaiming 
}) => {
  if (!currentState && currentState !== 0) return null

  const getStateColor = () => {
    switch (currentState) {
      case 0:
        return timeLeft.donation > 0 
          ? "bg-gradient-to-r from-emerald-500 to-green-600"
          : "bg-gradient-to-r from-blue-500 to-indigo-600"
      case 1:
        return "bg-gradient-to-r from-blue-500 to-indigo-600"
      case 2:
        return "bg-gradient-to-r from-amber-500 to-yellow-600"
      case 3:
        return "bg-gradient-to-r from-purple-500 to-violet-600"
      case 4:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  switch (currentState) {
    case 0: // Donation Period
      return (
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDonate}
            className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Heart size={18} />
            Donate
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegister}
            className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Register
          </motion.button>
        </div>
      )
    case 1: // Registration Period
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRegister}
          className="w-full px-4 py-3 mt-6 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          Register as Victim
        </motion.button>
      )
    case 2: // Waiting Period
      return (
        <div className="w-full px-4 py-3 mt-6 text-sm text-center text-gray-600 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          Campaign is in waiting period
        </div>
      )
    case 3: // Distribution Period
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClaim}
          disabled={isClaiming}
          className={`w-full px-4 py-3 mt-6 text-sm font-semibold text-white flex items-center justify-center gap-2 ${
            isClaiming
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 shadow-lg hover:shadow-purple-200 transition-all duration-300"
          }`}
        >
          {isClaiming ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Coins size={18} />
              Claim Funds
            </>
          )}
        </motion.button>
      )
    case 4: // Closed
      return (
        <div className="w-full px-4 py-3 mt-6 text-sm text-center text-gray-600 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          Campaign has ended
        </div>
      )
    default:
      return null
  }
}

export default ActionButtons 