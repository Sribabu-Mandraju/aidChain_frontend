"use client"

import { useState, useEffect, useRef, memo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  Share2,
  Link,
  X,
  MessageCircle,
  Twitter,
  Facebook,
  MapPin,
  UserPlus,
  Wallet,
  Coins,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Heart,
  Users,
  Info,
  ExternalLink,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton } from "react-share"
import CampaignMap from "./campaignCard_components/CampaignMap"
import { getWriteDisasterReliefContract } from "../../providers/disasterRelief_provider"
import {
  donate,
  isDonor,
  getUSDCBalance,
  publicClient,
  hasWithdrawn,
  isVictim,
  getState,
  getDonationEndTime,
  getRegistrationEndTime,
  getWaitingEndTime,
  getDistributionEndTime,
} from "../../providers/disasterRelief_provider"
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi"
import { coinbaseWallet } from "@wagmi/connectors"
import { baseSepolia } from "viem/chains"
import { toast } from "react-hot-toast"
import CampaignDetailsModal from "./campaignCard_components/CampaignDetailsModal"
import DonationModal from "./DonationModal"
import CampaignHeader from "./campaignCard_components/CampaignHeader"
import CampaignStats from "./campaignCard_components/CampaignStats"
import ActionButtons from "./campaignCard_components/ActionButtons"
import ShareModal from "./campaignCard_components/ShareModal"
import MapModal from "./campaignCard_components/MapModal"
import ClaimFundModal from "./campaignCard_components/ClaimFundModal"

// Memoized DonationModalContent component to prevent unnecessary re-renders
const DonationModalContent = memo(
  ({
    campaign,
    isConnected,
    isConnecting,
    balance,
    donationAmount,
    error,
    success,
    isLoading,
    formatBalance,
    handleConnectWallet,
    handleDonationAmountChange,
    handleDonate,
    onClose,
  }) => {
    const inputRef = useRef(null)

    // Focus the input when the component mounts
    useEffect(() => {
      if (inputRef.current && isConnected) {
        setTimeout(() => {
          inputRef.current.focus()
        }, 50)
      }
    }, [isConnected])

    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Donate to Support</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm leading-relaxed">
            Your donation will directly help victims affected by {campaign.title.toLowerCase()}. Funds are securely
            managed through smart contracts and distributed fairly.
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-200 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-300"
            >
              {isConnecting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Wallet size={20} />
                  Connect Coinbase Smart Wallet
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Your USDC Balance</p>
                <p className="text-lg font-semibold text-gray-800">
                  {balance ? `${formatBalance(balance)} USDC` : "Loading..."}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Coins size={20} className="text-green-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount (USDC)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-500" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={donationAmount}
                  onChange={handleDonationAmountChange}
                  placeholder="e.g., 10.00"
                  min="0"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 text-lg"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDonate}
              disabled={isLoading || !donationAmount || Number(donationAmount) <= 0}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
                isLoading || !donationAmount || Number(donationAmount) <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg hover:shadow-green-200 transition-all duration-300"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Heart size={20} />
                  Donate Now
                </>
              )}
            </motion.button>

            <p className="text-xs text-center text-gray-500 mt-4">
              All donations are processed securely on the Base Sepolia blockchain.
            </p>
          </div>
        )}
      </div>
    )
  },
)

// Ensure displayName is set for React DevTools
DonationModalContent.displayName = "DonationModalContent"

const CampaignCard = ({ campaign, index }) => {
  const [hovered, setHovered] = useState(false)
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [currentState, setCurrentState] = useState(null)
  const [timeLeft, setTimeLeft] = useState({
    donation: 0,
    registration: 0,
    waiting: 0,
    distribution: 0,
  })
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: coinbaseWallet({
      appName: "Disaster Relief",
      chainId: baseSepolia.id,
    }),
  })
  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient()

  // USDC address (Base Sepolia testnet USDC)
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

  // Share URL
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/campaigns/${campaign.id}` : ""
  const shareTitle = `Support ${campaign.title} - Help make a difference!`

  // Format amount to USDC decimals (6 decimals)
  const formatAmount = (value) => {
    const num = Number(value)
    if (isNaN(num) || num <= 0) return 0
    return BigInt(Math.floor(num * 1e6))
  }

  // Format balance for display
  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return "0.00"
    return (Number(balance) / 1e6).toFixed(2)
  }

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return "Not connected"
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Format time left
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Ended"
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  // Update state and time left
  const updateStateAndTime = useCallback(async () => {
    try {
      const currentState = await getState(campaign.contractAddress)
      const currentTime = Math.floor(Date.now() / 1000)

      let timeLeft = 0
      let nextState = currentState

      switch (currentState) {
        case 0: // Donation
          timeLeft = campaign.donationEndTime - currentTime
          if (timeLeft <= 0) {
            nextState = 1 // Registration
            timeLeft = campaign.registrationEndTime - currentTime
          }
          break
        case 1: // Registration
          timeLeft = campaign.registrationEndTime - currentTime
          if (timeLeft <= 0) {
            nextState = 2 // Waiting
            timeLeft = campaign.waitingEndTime - currentTime
          }
          break
        case 2: // Waiting
          timeLeft = campaign.waitingEndTime - currentTime
          if (timeLeft <= 0) {
            nextState = 3 // Distribution
            timeLeft = campaign.distributionEndTime - currentTime
          }
          break
        case 3: // Distribution
          timeLeft = campaign.distributionEndTime - currentTime
          if (timeLeft <= 0) {
            nextState = 4 // Closed
            timeLeft = 0
          }
          break
        case 4: // Closed
          timeLeft = 0
          break
        default:
          timeLeft = 0
      }

      setCurrentState(nextState)
      setTimeLeft(timeLeft)
    } catch (error) {
      console.error("Error updating state:", error)
    }
  }, [campaign])

  // Calculate campaign progress
  const calculateProgress = useCallback((state, timeLeft) => {
    let progress = 0
    let totalDuration = 0
    let elapsedTime = 0

    switch (state) {
      case 0: // Donation
        totalDuration = campaign.donationEndTime - campaign.createdAt
        elapsedTime = campaign.donationEndTime - timeLeft - campaign.createdAt
        break
      case 1: // Registration
        totalDuration = campaign.registrationEndTime - campaign.donationEndTime
        elapsedTime = campaign.registrationEndTime - timeLeft - campaign.donationEndTime
        break
      case 2: // Waiting
        totalDuration = campaign.waitingEndTime - campaign.registrationEndTime
        elapsedTime = campaign.waitingEndTime - timeLeft - campaign.registrationEndTime
        break
      case 3: // Distribution
        totalDuration = campaign.distributionEndTime - campaign.waitingEndTime
        elapsedTime = campaign.distributionEndTime - timeLeft - campaign.waitingEndTime
        break
      case 4: // Closed
        progress = 100
        break
      default:
        progress = 0
    }

    if (state !== 4) {
      progress = Math.min(100, Math.max(0, (elapsedTime / totalDuration) * 100))
    }

    setProgress(progress)
  }, [campaign])

  // Get state-specific color
  const getStateColor = useCallback(() => {
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
  }, [currentState, timeLeft.donation])

  // Get state-specific icon
  const getStateIcon = useCallback(() => {
    switch (currentState) {
      case 0:
        return timeLeft.donation > 0 ? <DollarSign size={16} /> : <UserPlus size={16} />
      case 1:
        return <UserPlus size={16} />
      case 2:
        return <Loader2 size={16} className="animate-spin" />
      case 3:
        return <Coins size={16} />
      case 4:
        return <CheckCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }, [currentState, timeLeft.donation])

  // Get state-specific message
  const getStateMessage = useCallback(() => {
    switch (currentState) {
      case 0:
        return timeLeft.donation > 0 ? "Donation Period" : "Registration Period"
      case 1:
        return "Registration Period"
      case 2:
        return "Waiting Period"
      case 3:
        return "Distribution Period"
      case 4:
        return "Campaign Ended"
      default:
        return "Loading..."
    }
  }, [currentState, timeLeft.donation])

  // Update state and time periodically
  useEffect(() => {
    const update = async () => {
      await updateStateAndTime()
    }
    update()

    const interval = setInterval(update, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [updateStateAndTime])

  useEffect(() => {
    calculateProgress(currentState, timeLeft)
  }, [currentState, timeLeft, calculateProgress])

  // Handle victim registration redirect
  const handleVictimRegister = () => {
    window.location.href = `/victim-registration/${campaign.id}`
  }

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden relative border border-gray-100"
    >
      <CampaignHeader
        campaign={campaign}
        onShare={() => setIsShareModalOpen(true)}
        onMap={() => setIsMapModalOpen(true)}
        onDetails={() => setIsDetailsModalOpen(true)}
        progress={progress}
        getStateColor={getStateColor}
        getStateIcon={getStateIcon}
        getStateMessage={getStateMessage}
      />

      {/* Card Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {truncateDescription(campaign.description, 120)}
          <button
            onClick={() => navigate(`/campaign/${campaign.id}`)}
            className="ml-1 text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            Read more
            <ExternalLink size={14} className="ml-1" />
          </button>
        </p>

        <CampaignStats campaign={campaign} />

        <ActionButtons
          currentState={currentState}
          timeLeft={timeLeft}
          onDonate={() => setIsDonateModalOpen(true)}
          onRegister={handleVictimRegister}
          onClaim={() => setIsClaimModalOpen(true)}
          isClaiming={isClaiming}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDonateModalOpen && (
          <DonationModal
            isOpen={isDonateModalOpen}
            onClose={() => setIsDonateModalOpen(false)}
            campaign={campaign}
          />
        )}
        {isShareModalOpen && <ShareModal />}
        {isMapModalOpen && <MapModal />}
        {isDetailsModalOpen && (
          <CampaignDetailsModal campaign={campaign} onClose={() => setIsDetailsModalOpen(false)} />
        )}
        {isClaimModalOpen && <ClaimFundModal />}
      </AnimatePresence>
    </motion.div>
  )
}

export default CampaignCard
