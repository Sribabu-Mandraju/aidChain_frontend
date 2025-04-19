"use client"

import { useState, useEffect } from "react"
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

const CampaignCard = ({ campaign, index }) => {
  const [hovered, setHovered] = useState(false)
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [isVictimModalOpen, setIsVictimModalOpen] = useState(false)
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [zkProof, setZkProof] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState(null)
  const [isDonorStatus, setIsDonorStatus] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isClaiming, setIsClaiming] = useState(false)
  const [currentState, setCurrentState] = useState(null)
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState({
    donation: 0,
    registration: 0,
    waiting: 0,
    distribution: 0,
  })
  const [progress, setProgress] = useState(0)

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

  // Get current state and time left
  const updateStateAndTime = async () => {
    try {
      const [state, donationEnd, registrationEnd, waitingEnd, distributionEnd] = await Promise.all([
        getState(campaign.contractAddress),
        getDonationEndTime(campaign.contractAddress),
        getRegistrationEndTime(campaign.contractAddress),
        getWaitingEndTime(campaign.contractAddress),
        getDistributionEndTime(campaign.contractAddress),
      ])

      const now = Math.floor(Date.now() / 1000)
      setCurrentState(state)

      const timeLeftValues = {
        donation: Number(donationEnd) - now,
        registration: Number(registrationEnd) - now,
        waiting: Number(waitingEnd) - now,
        distribution: Number(distributionEnd) - now,
      }

      setTimeLeft(timeLeftValues)

      // Calculate progress based on current state and time left
      calculateProgress(state, timeLeftValues, {
        donationEnd: Number(donationEnd),
        registrationEnd: Number(registrationEnd),
        waitingEnd: Number(waitingEnd),
        distributionEnd: Number(distributionEnd),
      })
    } catch (error) {
      console.error("Error updating state:", error)
    }
  }

  // Calculate campaign progress
  const calculateProgress = (state, timeLeftObj, endTimes) => {
    const now = Math.floor(Date.now() / 1000)
    let progressValue = 0

    // Total campaign duration (assuming linear progression through states)
    const totalDuration =
      endTimes.distributionEnd - (endTimes.donationEnd - timeLeftObj.donation - (state > 0 ? 0 : timeLeftObj.donation))

    // Calculate how much time has passed
    let timePassed = 0

    switch (state) {
      case 0: // Donation period
        timePassed =
          timeLeftObj.donation > 0
            ? endTimes.donationEnd - now
            : endTimes.donationEnd - (endTimes.donationEnd - timeLeftObj.donation)
        break
      case 1: // Registration period
        timePassed = endTimes.donationEnd + (endTimes.registrationEnd - now)
        break
      case 2: // Waiting period
        timePassed =
          endTimes.donationEnd + (endTimes.registrationEnd - endTimes.donationEnd) + (endTimes.waitingEnd - now)
        break
      case 3: // Distribution period
        timePassed =
          endTimes.donationEnd +
          (endTimes.registrationEnd - endTimes.donationEnd) +
          (endTimes.waitingEnd - endTimes.registrationEnd) +
          (endTimes.distributionEnd - now)
        break
      case 4: // Ended
        timePassed = totalDuration
        break
      default:
        timePassed = 0
    }

    progressValue = Math.min(100, Math.max(0, Math.floor((timePassed / totalDuration) * 100)))
    setProgress(progressValue)
  }

  // Get state-specific time left
  const getStateTimeLeft = () => {
    switch (currentState) {
      case 0:
        return timeLeft.donation
      case 1:
        return timeLeft.registration
      case 2:
        return timeLeft.waiting
      case 3:
        return timeLeft.distribution
      default:
        return 0
    }
  }

  // Get state-specific message
  const getStateMessage = () => {
    switch (currentState) {
      case 0:
        return "Donation Period"
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
  }

  // Get state-specific color
  const getStateColor = () => {
    switch (currentState) {
      case 0:
        return "bg-gradient-to-r from-emerald-500 to-green-600"
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

  // Get state-specific icon
  const getStateIcon = () => {
    switch (currentState) {
      case 0:
        return <DollarSign size={16} />
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
  }

  // Update state and time periodically
  useEffect(() => {
    updateStateAndTime()
    const interval = setInterval(updateStateAndTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [campaign.contractAddress])

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

  // Handle donation
  const handleDonate = async () => {
    if (!isConnected || !walletClient) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!donationAmount || Number(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const formattedAmount = formatAmount(donationAmount)

      // Execute donation with proper error handling
      const txHash = await toast.promise(
        donate(campaign.contractAddress, USDC_ADDRESS, formattedAmount, walletClient),
        {
          loading: "Processing donation...",
          success: "Donation submitted!",
          error: (error) => {
            if (error.message.includes("insufficient funds")) {
              return "Insufficient funds for gas fee"
            }
            if (error.message.includes("user rejected")) {
              return "Transaction rejected by user"
            }
            if (error.message.includes("SafeERC20")) {
              return "USDC transfer failed. Please try approving the contract first."
            }
            if (error.message.includes("gas")) {
              return "Failed to estimate gas. Please try again."
            }
            return `Donation failed: ${error.message}`
          },
        },
      )

      // Wait for transaction to be mined
      await toast.promise(publicClient.waitForTransactionReceipt({ hash: txHash }), {
        loading: "Confirming donation...",
        success: (receipt) => (
          <div className="flex flex-col">
            <span>Donation successful!</span>
            <a
              href={`https://sepolia.basescan.org/tx/${receipt.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View transaction
            </a>
          </div>
        ),
        error: "Donation failed to confirm.",
      })

      // Update donor status and balance
      const [donorStatus, newBalance] = await Promise.all([
        isDonor(campaign.contractAddress, address),
        getUSDCBalance(USDC_ADDRESS, address),
      ])

      setIsDonorStatus(donorStatus)
      setBalance(newBalance)
      setDonationAmount("")
      setSuccess(`Thank you for your ${donationAmount} USDC donation to ${campaign.title}!`)
      setTimeout(() => {
        setIsDonateModalOpen(false)
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Donation error:", error)
      setError(
        error.message.includes("insufficient funds")
          ? "Insufficient funds for gas fee"
          : error.message.includes("user rejected")
            ? "Transaction rejected by user"
            : error.message.includes("SafeERC20")
              ? "USDC transfer failed. Please try approving the contract first."
              : error.message.includes("gas")
                ? "Failed to estimate gas. Please try again."
                : `Donation failed: ${error.message}`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Handle victim registration redirect
  const handleVictimRegister = () => {
    window.location.href = `/victim-registration/${campaign.id}`
  }

  // Handle claim fund
  const handleClaimFund = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!walletClient) {
      toast.error("Wallet client not available")
      return
    }

    setIsClaiming(true)
    setError("")
    setSuccess("")

    try {
      // First check if user has already withdrawn
      const hasAlreadyWithdrawn = await hasWithdrawn(campaign.contractAddress, address)
      if (hasAlreadyWithdrawn) {
        setError("You have already claimed your funds for this campaign.")
        return
      }

      // Check if user is a verified victim
      const isVerifiedVictim = await isVictim(campaign.contractAddress, address)
      if (!isVerifiedVictim) {
        setError("You are not a verified victim for this campaign.")
        return
      }

      // Get the write contract instance
      const contract = await getWriteDisasterReliefContract(campaign.contractAddress, walletClient)
      if (!contract || !contract.walletClient) {
        throw new Error("Contract or wallet client not available")
      }

      // Execute withdrawal with proper error handling
      const txHash = await toast.promise(
        contract.walletClient.writeContract({
          address: contract.address,
          abi: contract.abi,
          functionName: "withdrawFunds",
          account: contract.account,
        }),
        {
          loading: "Processing withdrawal...",
          success: "Withdrawal submitted!",
          error: (error) => {
            if (error.message.includes("insufficient funds")) {
              return "Insufficient funds for gas fee"
            }
            if (error.message.includes("user rejected")) {
              return "Transaction rejected by user"
            }
            if (error.message.includes("already withdrawn")) {
              return "You have already claimed your funds"
            }
            return `Withdrawal failed: ${error.message}`
          },
        },
      )

      // Wait for transaction to be mined
      await toast.promise(publicClient.waitForTransactionReceipt({ hash: txHash }), {
        loading: "Confirming withdrawal...",
        success: (receipt) => (
          <div className="flex flex-col">
            <span>Funds claimed successfully!</span>
            <a
              href={`https://sepolia.basescan.org/tx/${receipt.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:underline"
            >
              View transaction
            </a>
          </div>
        ),
        error: "Withdrawal failed to confirm.",
      })

      setSuccess("Funds claimed successfully!")
      setTimeout(() => {
        setIsClaimModalOpen(false)
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Claim error:", error)
      setError(
        error.message.includes("insufficient funds")
          ? "Insufficient funds for gas fee"
          : error.message.includes("user rejected")
            ? "Transaction rejected by user"
            : error.message.includes("already withdrawn")
              ? "You have already claimed your funds"
              : `Failed to claim funds: ${error.message}`,
      )
    } finally {
      setIsClaiming(false)
    }
  }

  // Load initial data
  const loadInitialData = async () => {
    if (!address || !isConnected) {
      setBalance(BigInt(0))
      setIsDonorStatus(false)
      return
    }

    try {
      const [donorStatus, currentBalance] = await Promise.all([
        isDonor(campaign.contractAddress, address),
        getUSDCBalance(USDC_ADDRESS, address),
      ])
      setIsDonorStatus(donorStatus)
      setBalance(currentBalance)
    } catch (error) {
      console.error("Error loading initial data:", error)
      toast.error("Failed to load account data.")
      setBalance(BigInt(0))
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [address, isConnected])

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard!")
  }

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Donation Modal
  const DonationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsDonateModalOpen(false)}
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
            <h3 className="text-2xl font-bold text-gray-900">Donate to Support</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={() => setIsDonateModalOpen(false)}
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
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="e.g., 10.00"
                  step="0.01"
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
      </motion.div>
    </motion.div>
  )

  // Share Modal
  const ShareModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsShareModalOpen(false)}
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
            <h3 className="text-2xl font-bold text-gray-900">Share Campaign</h3>
            <p className="text-sm text-gray-500 mt-1">Help spread the word about {campaign.title}</p>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <WhatsappShareButton url={shareUrl} title={shareTitle} className="w-full">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 border border-green-100 transition-colors">
                  <MessageCircle size={20} />
                  <span className="font-medium">WhatsApp</span>
                </div>
              </WhatsappShareButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TwitterShareButton url={shareUrl} title={shareTitle} className="w-full">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                  <Twitter size={20} />
                  <span className="font-medium">Twitter</span>
                </div>
              </TwitterShareButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <FacebookShareButton url={shareUrl} quote={shareTitle} className="w-full">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                  <Facebook size={20} />
                  <span className="font-medium">Facebook</span>
                </div>
              </FacebookShareButton>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyLink}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">
                <Link size={20} />
                <span className="font-medium">Copy Link</span>
              </div>
            </motion.button>
          </div>

          {/* Campaign Link Preview */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">Campaign Link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  // Map Modal
  const MapModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsMapModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-5xl w-full h-[80vh] max-h-[600px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Campaign Location</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={() => setIsMapModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-[calc(100%-80px)] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
          <CampaignMap
            latitude={campaign.latitude}
            longitude={campaign.longitude}
            radius={campaign.radius}
            title={campaign.title}
          />
        </div>
      </motion.div>
    </motion.div>
  )

  // Claim Fund Modal
  const ClaimFundModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsClaimModalOpen(false)}
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
            <h3 className="text-2xl font-bold text-gray-900">Claim Relief Funds</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={() => setIsClaimModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <p className="text-purple-800 text-sm leading-relaxed">
            As a verified victim, you can claim your allocated funds from this campaign. The funds will be transferred
            directly to your connected wallet.
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
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Your Wallet</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{formatAddress(address)}</p>
              </div>

              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Amount to Claim</p>
                <p className="text-sm font-semibold text-gray-800">{campaign.amountPerVictim} USDC</p>
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
              onClick={handleClaimFund}
              disabled={isClaiming}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
                isClaiming
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 shadow-lg hover:shadow-purple-200 transition-all duration-300"
              }`}
            >
              {isClaiming ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Coins size={20} />
                  Claim Funds
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )

  // State-specific action buttons
  const renderActionButtons = () => {
    if (!currentState && currentState !== 0) return null

    switch (currentState) {
      case 0: // Donation Period
        return (
          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDonateModalOpen(true)}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Heart size={18} />
              Donate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVictimRegister}
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
            onClick={handleVictimRegister}
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
            onClick={() => setIsClaimModalOpen(true)}
            className="w-full px-4 py-3 mt-6 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Coins size={18} />
            Claim Funds
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
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        <div className={`h-full ${getStateColor()}`} style={{ width: `${progress}%` }}></div>
      </div>

      {/* State Indicator */}
      <div
        className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getStateColor()} shadow-md z-10`}
      >
        {getStateIcon()}
        <span>{getStateMessage()}</span>
      </div>

      {/* Time Left Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gray-800/80 backdrop-blur-sm shadow-md z-10">
        <Clock size={14} />
        <span>{formatTimeLeft(getStateTimeLeft())}</span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-[140px] flex gap-2 z-10">
        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsShareModalOpen(true)}
          className="p-2 text-gray-600 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          title="Share Campaign"k
        >
          <Share2 size={18} />
        </motion.button>

        {/* Map Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMapModalOpen(true)}
          className="p-2 text-gray-600 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          title="View on map"
        >
          <MapPin size={18} />
        </motion.button>

        {/* Details Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDetailsModalOpen(true)}
          className="p-2 text-gray-600 bg-white/90 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          title="Campaign details"
        >
          <Info size={18} />
        </motion.button>
      </div>

      {/* Card Layout */}
      <div className="flex flex-col">
        {/* Card Image */}
        <div className="relative h-[240px] overflow-hidden">
          <img
            src={campaign.image || "/placeholder.svg?height=400&width=600"}
            alt={campaign.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="text-2xl font-bold text-white drop-shadow-md">{campaign.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                <Users size={12} />
                <span>{campaign.victimsCount} victims</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                <Heart size={12} />
                <span>{campaign.totalDonations} donations</span>
              </div>
            </div>
          </div>
        </div>

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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-3 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Per Victim</div>
                  <div className="text-lg font-bold text-gray-800">
                    {campaign.amountPerVictim} <span className="text-sm font-normal text-gray-600">USDC</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Coins size={20} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Campaign ID</div>
                  <div className="text-sm font-medium text-gray-800 truncate" title={campaign.id}>
                    {campaign.id ? campaign.id.substring(0, 8) + "..." : "N/A"}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {renderActionButtons()}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDonateModalOpen && <DonationModal />}
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
