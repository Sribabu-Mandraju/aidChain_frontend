import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import { coinbaseWallet } from '@wagmi/connectors';
import { baseSepolia } from 'viem/chains';
import { toast } from 'react-hot-toast';
import { donate, getBalance, isDonor, publicClient, ensureUsdcApproval } from '../../../providers/fund_escrow_provider';

const DonationSection = ({ campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationType, setDonationType] = useState("campaign");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  const [isDonorStatus, setIsDonorStatus] = useState(null);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: coinbaseWallet({
      appName: 'Disaster Relief',
      chainId: baseSepolia.id,
    }),
  });
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  // Format amount to USDC decimals (6 decimals)
  const formatAmount = (value) => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 0;
    return Math.floor(num * 1000000);
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

    if (donationType === "campaign" && !selectedCampaign) {
      toast.error('Please select a campaign to donate to');
      return;
    }

    setIsLoading(true);
    try {
      const formattedAmount = formatAmount(donationAmount);
      
      // Ensure USDC approval
      await toast.promise(
        ensureUsdcApproval(walletClient, formattedAmount),
        {
          loading: 'Checking USDC approval...',
          success: 'USDC approved for donation',
          error: 'Failed to approve USDC. Please try again.',
        }
      );

      // Execute donation
      const txHash = await toast.promise(
        donate(formattedAmount, walletClient),
        {
          loading: 'Submitting donation...',
          success: 'Donation submitted!',
          error: (error) => `Donation failed: ${error.message}`,
        }
      );

      // Wait for transaction to be mined
      await toast.promise(
        publicClient.waitForTransactionReceipt({ hash: txHash }),
        {
          loading: 'Processing donation...',
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
        isDonor(address),
        getBalance(),
      ]);

      setIsDonorStatus(donorStatus);
      setBalance(newBalance);
      setDonationAmount("");
      setSelectedCampaign("");

      toast.success('Donation completed successfully!');
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(
        error.message.includes('Unknown Ethereum address') ? 'Your wallet address is not registered. Please register with the platform or contact support.' :
        error.message.includes('ABI encoding') ? 'Contract configuration error. Please contact support.' :
        error.message.includes('rejected') ? 'Transaction rejected by user.' :
        error.message.includes('insufficient') ? 'Insufficient USDC balance.' :
        error.message.includes('network') ? 'Network error. Please try again.' :
        error.message.includes('chain ID') ? 'Please switch to Base Sepolia network.' :
        error.message.includes('SafeERC20') ? 'USDC transfer failed. Please approve the contract.' :
        `Donation failed: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    if (!address) return;

    try {
      const [donorStatus, currentBalance] = await Promise.all([
        isDonor(address),
        getBalance(),
      ]);
      setIsDonorStatus(donorStatus);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load account data.');
    }
  };

  // Format balance for display
  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return (Number(balance) / 1000000).toFixed(2);
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    if (address) {
      loadInitialData();
    }
  }, [address]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-12 shadow-lg"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            Make a Difference Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Choose to support a specific campaign or donate to our organization
            to fund ongoing relief efforts.
          </p>

          {!isConnected ? (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <>
              {/* <div className="mb-6 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Connected: {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Disconnect
                </button>
              </div> */}

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDonationType("campaign")}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                    donationType === "campaign"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50"
                  }`}
                >
                  Donate to a Campaign
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDonationType("organization")}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                    donationType === "organization"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-green-50"
                  }`}
                >
                  Donate to Organization
                </motion.button>
              </div>

              <div className="max-w-lg mx-auto space-y-6">
                {donationType === "campaign" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Campaign
                    </label>
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    >
                      <option value="">Choose a campaign</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Current Escrow Balance: {balance ? `${formatBalance(balance)} USDC` : 'Loading...'}
                  </p>
                  {isDonorStatus && (
                    <p className="text-sm text-green-600 mt-1">
                      You are a verified donor! Thank you for your support.
                    </p>
                  )}
                </div>

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
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DonationSection;