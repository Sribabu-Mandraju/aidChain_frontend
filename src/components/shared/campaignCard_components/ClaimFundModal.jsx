import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Coins, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { useAccount, useWalletClient } from "wagmi"
import { hasWithdrawn, withdrawFunds } from "../../../providers/disasterRelief_provider"

const ClaimFundModal = ({ campaign, onClose }) => {
  const [isClaiming, setIsClaiming] = useState(false)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [error, setError] = useState(null)
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const checkClaimStatus = useCallback(async () => {
    try {
      const claimed = await hasWithdrawn(campaign.contractAddress, address)
      setHasClaimed(claimed)
    } catch (error) {
      console.error("Error checking claim status:", error)
      setError("Failed to check claim status")
    }
  }, [campaign.contractAddress, address])

  useEffect(() => {
    if (address) {
      checkClaimStatus()
    }
  }, [address, checkClaimStatus])

  const handleClaim = async () => {
    if (!walletClient) {
      toast.error("Please connect your wallet first")
      return
    }

    if (hasClaimed) {
      toast.error("You have already claimed your funds")
      return
    }

    setIsClaiming(true)
    setError(null)

    try {
      const tx = await withdrawFunds(campaign.contractAddress, walletClient)
      await tx.wait()
      setHasClaimed(true)
      toast.success("Funds claimed successfully!")
    } catch (error) {
      console.error("Error claiming funds:", error)
      setError("Failed to claim funds. Please try again.")
      toast.error("Failed to claim funds")
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Claim Funds</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Claim Status */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Claim Status</p>
                <p className="text-gray-900 font-medium">
                  {hasClaimed ? "Funds Claimed" : "Available for Claim"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                {hasClaimed ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <Coins size={20} className="text-blue-600" />
                )}
              </div>
            </div>
          </div>

          {/* Claim Amount */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount to Claim</p>
                <p className="text-lg font-bold text-gray-800">
                  {campaign.amountPerVictim} <span className="text-sm font-normal text-gray-600">USDC</span>
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Coins size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Claim Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClaim}
            disabled={isClaiming || hasClaimed}
            className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
              isClaiming || hasClaimed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 shadow-lg hover:shadow-purple-200 transition-all duration-300"
            }`}
          >
            {isClaiming ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : hasClaimed ? (
              <>
                <CheckCircle size={20} />
                Funds Claimed
              </>
            ) : (
              <>
                <Coins size={20} />
                Claim Funds
              </>
            )}
          </motion.button>

          {/* Additional Information */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-800 text-sm leading-relaxed">
              Once claimed, the funds will be transferred to your connected wallet address. Please ensure you have the correct wallet connected.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ClaimFundModal 