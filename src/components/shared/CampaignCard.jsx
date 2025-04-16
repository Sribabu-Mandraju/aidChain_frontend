import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Gift,
  Share2,
  Link,
  X,
  MessageCircle,
  Twitter,
  Facebook,
  MapPin,
  UserPlus,
  Wallet,
} from "lucide-react";
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
} from "react-share";
import CampaignMap from "./campaignCard_components/CampaignMap";
import { donate, registerAsVictim, isDonor, getUSDCBalance, publicClient } from "../../providers/disasterRelief_provider";
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import { coinbaseWallet } from '@wagmi/connectors';
import { baseSepolia } from 'viem/chains';
import { toast } from 'react-hot-toast';
import CampaignDetailsModal from "./campaignCard_components/CampaignDetailsModal";

const CampaignCard = ({ campaign, index }) => {
  const [hovered, setHovered] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isVictimModalOpen, setIsVictimModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [zkProof, setZkProof] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  const [isDonorStatus, setIsDonorStatus] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: coinbaseWallet({
      appName: 'Disaster Relief',
      chainId: baseSepolia.id,
    }),
  });
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  // USDC address (Base Sepolia testnet USDC, replace with actual address)
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Update with your contract's USDC address

  // Share URL
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/${campaign.id}`
      : "";
  const shareTitle = `Support ${campaign.title} - Help make a difference!`;

  // Format amount to USDC decimals (6 decimals)
  const formatAmount = (value) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 0;
    return BigInt(Math.floor(num * 1e6));
  };

  // Format balance for display
  const formatBalance = (balance) => {
    if (balance === null || balance === undefined) return '0.00';
    return (Number(balance) / 1e6).toFixed(2);
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return 'Not connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle donation
  const handleDonate = async () => {
    if (!isConnected || !walletClient) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!donationAmount || Number(donationAmount) <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formattedAmount = formatAmount(donationAmount);

      // Execute donation with proper error handling
      const txHash = await toast.promise(
        donate(campaign.contractAddress, USDC_ADDRESS, formattedAmount, walletClient),
        {
          loading: 'Processing donation...',
          success: 'Donation submitted!',
          error: (error) => {
            if (error.message.includes('insufficient funds')) {
              return 'Insufficient funds for gas fee';
            }
            if (error.message.includes('user rejected')) {
              return 'Transaction rejected by user';
            }
            if (error.message.includes('SafeERC20')) {
              return 'USDC transfer failed. Please try approving the contract first.';
            }
            if (error.message.includes('gas')) {
              return 'Failed to estimate gas. Please try again.';
            }
            return `Donation failed: ${error.message}`;
          },
        }
      );

      // Wait for transaction to be mined
      await toast.promise(
        publicClient.waitForTransactionReceipt({ hash: txHash }),
        {
          loading: 'Confirming donation...',
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
          error: 'Donation failed to confirm.',
        }
      );

      // Update donor status and balance
      const [donorStatus, newBalance] = await Promise.all([
        isDonor(campaign.contractAddress, address),
        getUSDCBalance(USDC_ADDRESS, address),
      ]);

      setIsDonorStatus(donorStatus);
      setBalance(newBalance);
      setDonationAmount("");
      setSuccess(`Thank you for your ${donationAmount} USDC donation to ${campaign.title}!`);
      setTimeout(() => {
        setIsDonateModalOpen(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error('Donation error:', error);
      setError(
        error.message.includes('insufficient funds') ? 'Insufficient funds for gas fee' :
        error.message.includes('user rejected') ? 'Transaction rejected by user' :
        error.message.includes('SafeERC20') ? 'USDC transfer failed. Please try approving the contract first.' :
        error.message.includes('gas') ? 'Failed to estimate gas. Please try again.' :
        `Donation failed: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle victim registration
  const handleVictimRegister = async () => {
    if (!isConnected || !walletClient) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!zkProof) {
      toast.error('Please provide a valid zero-knowledge proof');
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const txHash = await toast.promise(
        registerAsVictim(campaign.contractAddress, zkProof, walletClient),
        {
          loading: 'Submitting victim registration...',
          success: 'Registration submitted!',
          error: (error) => `Registration failed: ${error.message}`,
        }
      );

      await toast.promise(
        publicClient.waitForTransactionReceipt({ hash: txHash }),
        {
          loading: 'Processing registration...',
          success: (receipt) => (
            <div className="flex flex-col">
              <span>Registration successful!</span>
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
          error: 'Registration failed to confirm.',
        }
      );

      setZkProof("");
      setSuccess(`Successfully registered as a victim for ${campaign.title}!`);
      setTimeout(() => {
        setIsVictimModalOpen(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error('Victim registration error:', error);
      setError(
        error.message.includes('rejected') ? 'Transaction rejected by user.' :
        error.message.includes('network') ? 'Network error. Please try again.' :
        error.message.includes('chain ID') ? 'Please switch to Base Sepolia network.' :
        `Registration failed: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    if (!address || !isConnected) {
      setBalance(BigInt(0));
      setIsDonorStatus(false);
      return;
    }

    try {
      const [donorStatus, currentBalance] = await Promise.all([
        isDonor(campaign.contractAddress, address),
        getUSDCBalance(USDC_ADDRESS, address),
      ]);
      setIsDonorStatus(donorStatus);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load account data.');
      setBalance(BigInt(0));
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [address, isConnected]);

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Donation Modal
  const DonationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsDonateModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Donate to {campaign.title}
          </h3>
          <button
            onClick={() => setIsDonateModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Your donation will help {campaign.title.toLowerCase()}. Every contribution counts!
        </p>
        {!isConnected ? (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
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
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Wallet: {formatAddress(address)}
              </p>
              <p className="text-sm text-gray-600">
                USDC Balance: {formatBalance(balance)} USDC
              </p>
              {isDonorStatus && (
                <p className="text-sm text-green-600 mt-1">
                  You are a verified donor! Thank you for your support.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (USDC)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm flex items-center gap-1">
                <Gift size={16} />
                {success}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDonate}
              disabled={isLoading || !donationAmount || Number(donationAmount) <= 0}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                isLoading || !donationAmount || Number(donationAmount) <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto" />
              ) : (
                'Donate Now'
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  // Victim Registration Modal
  const VictimRegistrationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsVictimModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Register as Victim for {campaign.title}
          </h3>
          <button
            onClick={() => setIsVictimModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Submit your zero-knowledge proof to register as a victim for this campaign.
        </p>
        {!isConnected ? (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
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
          <div className="space-y-4">
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Wallet: {formatAddress(address)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zero-Knowledge Proof
              </label>
              <input
                type="text"
                value={zkProof}
                onChange={(e) => setZkProof(e.target.value)}
                placeholder="Enter ZK proof"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm flex items-center gap-1">
                <Gift size={16} />
                {success}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVictimRegister}
              disabled={isLoading || !zkProof}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                isLoading || !zkProof
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto" />
              ) : (
                'Register Now'
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  // Share Modal
  const ShareModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsShareModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Share {campaign.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Help spread the word about this campaign
            </p>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <WhatsappShareButton
                url={shareUrl}
                title={shareTitle}
                className="w-full"
              >
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <MessageCircle size={20} />
                  <span className="font-medium">WhatsApp</span>
                </div>
              </WhatsappShareButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TwitterShareButton
                url={shareUrl}
                title={shareTitle}
                className="w-full"
              >
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Twitter size={20} />
                  <span className="font-medium">Twitter</span>
                </div>
              </TwitterShareButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FacebookShareButton
                url={shareUrl}
                quote={shareTitle}
                className="w-full"
              >
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Facebook size={20} />
                  <span className="font-medium">Facebook</span>
                </div>
              </FacebookShareButton>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Link size={20} />
                <span className="font-medium">Copy Link</span>
              </div>
            </motion.button>
          </div>

          {/* Campaign Link Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Campaign Link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Copy
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Map Modal
  const MapModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsMapModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full h-[80vh] max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {campaign.title} - Location
          </h3>
          <button
            onClick={() => setIsMapModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="h-[calc(100%-60px)]">
          <CampaignMap
            latitude={campaign.latitude}
            longitude={campaign.longitude}
            radius={campaign.radius}
            title={campaign.title}
          />
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
    >
      {/* Share Button - Moved to top right */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsShareModalOpen(true)}
        className="absolute top-4 right-4 p-2 text-gray-600 bg-white/90 hover:bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 z-10"
        title="Share Campaign"
      >
        <Share2 size={20} />
      </motion.button>

      <div className="flex flex-col md:flex-row">
        {/* Card Image */}
        <div className="relative h-[300px] overflow-hidden md:w-2/5 md:min-h-[250px]">
          <img
            src={campaign.image || "/placeholder.svg?height=400&width=600"}
            alt={campaign.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-4 md:hidden">
            <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
          </div>
          <span
            className={`absolute top-4 right-16 px-3 py-1 rounded-full text-xs font-semibold ${
              campaign.status === "Active"
                ? "bg-green-500 text-white"
                : campaign.status === "Closed"
                ? "bg-gray-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {campaign.status}
          </span>

          {/* Map Pin Button */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="absolute bottom-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 group-hover:scale-110"
            aria-label="View on map"
          >
            <MapPin size={20} className="text-green-600" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col justify-between md:w-3/5">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 hidden md:block">
              {campaign.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {truncateDescription(
                `Location: Lat ${campaign.latitude}, Lon ${campaign.longitude}, Radius ${campaign.radius}`
              )}
              <button
                onClick={() => setIsDetailsModalOpen(true)}
                className="ml-1 text-green-600 hover:text-green-700 font-medium"
              >
                Know more
              </button>
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 rounded-lg p-2 w-[40%] text-center">
                <div className="text-green-600 font-semibold text-lg">
                  {campaign.totalDonations}
                </div>
                <div className="text-xs text-gray-500">Total Donations</div>
              </div>
              <div className="w-[20%]"></div> {/* Gap in middle */}
              <div className="bg-green-50 rounded-lg p-2 w-[40%] text-center">
                <div className="text-green-600 font-semibold text-lg">
                  {campaign.victimsCount}
                </div>
                <div className="text-xs text-gray-500">Total Victims</div>
              </div>
            </div>

            {/* Amount Per Victim */}
            <div className="text-center mb-4">
              <div className="text-gray-600 text-sm">
                Amount per Victim: {campaign.amountPerVictim}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="w-[35%] px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-400 hover:to-emerald-500 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Donate
            </button>
            <button
              onClick={() => setIsVictimModalOpen(true)}
              className="w-[35%] px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-400 hover:to-blue-500 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Register as Victim
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDonateModalOpen && <DonationModal />}
        {isVictimModalOpen && <VictimRegistrationModal />}
        {isShareModalOpen && <ShareModal />}
        {isMapModalOpen && <MapModal />}
        {isDetailsModalOpen && (
          <CampaignDetailsModal
            campaign={campaign}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CampaignCard;