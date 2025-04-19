"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, UserPlus, Coins, AlertCircle, Wallet } from "lucide-react"
import DonateModal from "../modals/DonateModal"
import ClaimFundsModal from "../modals/ClaimFundsModal"
import { useAccount, useConnect } from "wagmi"
import { coinbaseWallet } from "@wagmi/connectors"
import { baseSepolia } from "viem/chains"
import { toast } from "react-hot-toast"

const CampaignActions = ({ campaign, currentState, contractAddress }) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: coinbaseWallet({
      appName: "Disaster Relief",
      chainId: baseSepolia.id,
    }),
  })

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true)
      await connect()
      toast.success("Wallet connected successfully")
    } catch (error) {
      console.error("Connection error:", error)
      toast.error("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle victim registration redirect
  const handleVictimRegister = () => {
    window.location.href = `/victim-registration/${campaign.id}`
  }

  // Render action buttons based on campaign state
  const renderActionButtons = () => {
    if (!isConnected) {
      return (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-200 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-300 mb-4"
        >
          {isConnecting ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Wallet size={20} />
              Connect Wallet to Interact
            </>
          )}
        </motion.button>
      )
    }

    switch (currentState) {
      case 0: // Donation Period
        return (
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsDonateModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg hover:shadow-green-200 transition-all duration-300"
            >
              <Heart size={20} />
              Donate Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleVictimRegister}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg hover:shadow-blue-200 transition-all duration-300"
            >
              <UserPlus size={20} />
              Register as Victim
            </motion.button>
          </div>
        )
      case 1: // Registration Period
        return (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleVictimRegister}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <UserPlus size={20} />
            Register as Victim
          </motion.button>
        )
      case 2: // Waiting Period
        return (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800">Verification in Progress</h4>
                <p className="text-sm text-amber-700 mt-1">
                  The campaign is currently in the waiting period. Victim claims are being verified. Please check back
                  during the distribution period to claim your funds if you're a verified victim.
                </p>
              </div>
            </div>
          </div>
        )
      case 3: // Distribution Period
        return (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsClaimModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 shadow-lg hover:shadow-purple-200 transition-all duration-300"
          >
            <Coins size={20} />
            Claim Your Funds
          </motion.button>
        )
      case 4: // Closed
        return (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-gray-600 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Campaign Ended</h4>
                <p className="text-sm text-gray-600 mt-1">
                  This campaign has ended and all funds have been distributed to verified victims. Thank you for your
                  interest and support.
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Actions</h2>

        {renderActionButtons()}

        {/* Modals */}
        <AnimatePresence>
          {isDonateModalOpen && (
            <DonateModal
              isOpen={isDonateModalOpen}
              onClose={() => setIsDonateModalOpen(false)}
              campaign={campaign}
              contractAddress={contractAddress}
            />
          )}

          {isClaimModalOpen && (
            <ClaimFundsModal
              isOpen={isClaimModalOpen}
              onClose={() => setIsClaimModalOpen(false)}
              campaign={campaign}
              contractAddress={contractAddress}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CampaignActions
