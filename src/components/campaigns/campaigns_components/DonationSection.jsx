import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Wallet, Heart, Gift, Sparkles, Shield, Globe, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi';
import { coinbaseWallet } from '@wagmi/connectors';
import { baseSepolia } from 'viem/chains';
import { toast } from 'react-hot-toast';
import { donate, getBalance, isDonor, publicClient, ensureUsdcApproval } from '../../../providers/fund_escrow_provider';

const DonationSection = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  const [isDonorStatus, setIsDonorStatus] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);

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

  useEffect(() => {
    if (address) {
      loadInitialData();
    }
  }, [address]);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10b981 1px, transparent 1px),
            linear-gradient(to bottom, #10b981 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className=" rounded-3xl p-8 sm:p-12 border border-green-100"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6"
            >
              <Heart className="w-16 h-16 text-green-600" />
            </motion.div>
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Difference</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your donation helps us provide immediate relief and long-term support to communities affected by disasters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
              {[
                { icon: Shield, title: "Transparent", description: "Every donation is tracked on the blockchain" },
                { icon: Globe, title: "Global Impact", description: "Support communities worldwide" },
                { icon: Users, title: "Community", description: "Join a network of donors making a difference" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveFeature(index)}
                  className={`bg-white p-6 rounded-2xl shadow-lg border border-green-100 cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'ring-2 ring-green-500 ring-offset-2' : ''
                  }`}
                >
                  <feature.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {!isConnected ? (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="group relative inline-flex items-center px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                <span className="relative flex items-center gap-2">
                  {isConnecting ? (
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Wallet size={24} />
                      Connect Coinbase Smart Wallet
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          ) : (
            <div className="max-w-lg mx-auto  space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r  bg-white from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Current Escrow Balance</h3>
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {balance ? `${formatBalance(balance)} USDC` : 'Loading...'}
                </p>
                {isDonorStatus && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 mt-4"
                  >
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-600 font-medium">
                      You are a verified donor! Thank you for your support.
                    </p>
                  </motion.div>
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xl font-medium text-gray-900 mb-3">
                    Donation Amount (USDC)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign size={24} className="text-gray-500" />
                    </div>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="e.g., 10.00"
                      step="0.01"
                      min="0"
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-5 text-xl rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDonate}
                  disabled={isLoading || !donationAmount || Number(donationAmount) <= 0}
                  className={`group relative w-full py-5 rounded-xl font-semibold text-white text-xl overflow-hidden ${
                    isLoading || !donationAmount || Number(donationAmount) <= 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
                  }`}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        Donate Now
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 17.75C960 17.75 1056 35.5 1152 44.375C1248 53.25 1344 53.25 1392 53.25H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
};

export default DonationSection;