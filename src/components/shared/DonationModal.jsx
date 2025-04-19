"use client"

import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  X,
  Wallet,
  Coins,
  AlertCircle,
  CheckCircle,
  Heart,
} from "lucide-react"
import { useAccount, useConnect, useWalletClient } from "wagmi"
import { coinbaseWallet } from "@wagmi/connectors"
import { baseSepolia } from "viem/chains"
import { toast } from "react-hot-toast"
import { donate, getUSDCBalance, publicClient, isDonor } from "../../providers/disasterRelief_provider"

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

    // Memoize the input component to prevent re-renders
    const DonationInput = memo(({ value, onChange, disabled }) => {
      const inputRef = useRef(null)

      // Focus the input when the component mounts
      useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, [])

      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount (USDC)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign size={18} className="text-gray-500" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={onChange}
              placeholder="e.g., 10.00"
              min="0"
              disabled={disabled}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 text-lg"
            />
          </div>
        </div>
      )
    })

    DonationInput.displayName = "DonationInput"

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

            <DonationInput
              value={donationAmount}
              onChange={handleDonationAmountChange}
              disabled={isLoading}
            />

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

DonationModalContent.displayName = "DonationModalContent"

const DonationModal = memo(({ isOpen, onClose, campaign }) => {
  const [donationAmount, setDonationAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState(null)
  const [isDonorStatus, setIsDonorStatus] = useState(null)

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: coinbaseWallet({
      appName: "Disaster Relief",
      chainId: baseSepolia.id,
    }),
  })
  const { data: walletClient } = useWalletClient()

  // USDC address (Base Sepolia testnet USDC)
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

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

  // Handle donation amount change
  const handleDonationAmountChange = useCallback((e) => {
    const value = e.target.value
    
    // Only allow numbers and a single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDonationAmount(value)
    }
  }, [])

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
              return "Insufficient funds for gas"
            }
            if (error.message.includes("user rejected")) {
              return "Transaction rejected"
            }
            if (error.message.includes("SafeERC20")) {
              return "USDC transfer failed"
            }
            if (error.message.includes("gas")) {
              return "Failed to estimate gas"
            }
            return "Donation failed"
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
        error: "Donation failed to confirm",
      })

      // Update donor status and balance
      const [donorStatus, newBalance] = await Promise.all([
        isDonor(campaign.contractAddress, address),
        getUSDCBalance(USDC_ADDRESS, address),
      ])

      setIsDonorStatus(donorStatus)
      setBalance(newBalance)
      setDonationAmount("")
      setSuccess(`Thank you for your ${donationAmount} USDC donation!`)
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Donation error:", error)
      setError(
        error.message.includes("insufficient funds")
          ? "Insufficient funds for gas"
          : error.message.includes("user rejected")
            ? "Transaction rejected"
            : error.message.includes("SafeERC20")
              ? "USDC transfer failed"
              : error.message.includes("gas")
                ? "Failed to estimate gas"
                : "Donation failed",
      )
    } finally {
      setIsLoading(false)
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
    if (isOpen) {
      loadInitialData()
    }
  }, [isOpen, address, isConnected])

  // Use a stable animation configuration that won't restart on re-renders
  const modalAnimation = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  }), [])

  const contentAnimation = useMemo(() => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { type: "spring", damping: 25, stiffness: 300 },
  }), [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div {...modalAnimation} className="w-full max-w-md">
        <motion.div {...contentAnimation}>
          <DonationModalContent
            campaign={campaign}
            isConnected={isConnected}
            isConnecting={isConnecting}
            balance={balance}
            donationAmount={donationAmount}
            error={error}
            success={success}
            isLoading={isLoading}
            formatBalance={formatBalance}
            handleConnectWallet={handleConnectWallet}
            handleDonationAmountChange={handleDonationAmountChange}
            handleDonate={handleDonate}
            onClose={onClose}
          />
        </motion.div>
      </motion.div>
    </div>
  )
})

DonationModal.displayName = "DonationModal"

export default DonationModal 