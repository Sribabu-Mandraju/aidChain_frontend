import { useState, useEffect } from 'react';
import { donate, getBalance, isDonor } from '../../providers/fund_escrow_provider';
import { toast } from 'react-hot-toast';
import { FaSpinner, FaWallet } from 'react-icons/fa';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { baseSepolia } from 'viem/chains';

const DonateForm = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDonorStatus, setIsDonorStatus] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: coinbaseWallet({
      appName: 'Disaster Relief',
      chainId: baseSepolia.id,
    }),
  });
  const { disconnect } = useDisconnect();

  // Format amount to USDC decimals (6 decimals)
  const formatAmount = (value) => {
    return Math.floor(Number(value) * 1000000);
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle donation
  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const formattedAmount = formatAmount(amount);
      const txHash = await donate(formattedAmount);
      
      // Wait for transaction to be mined
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(txHash);
          }, 2000);
        }),
        {
          loading: 'Processing donation...',
          success: (hash) => (
            <div className="flex flex-col">
              <span>Donation successful!</span>
              <a 
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline"
              >
                View transaction
              </a>
            </div>
          ),
          error: 'Donation failed',
        }
      );

      // Update donor status and balance
      const [donorStatus, newBalance] = await Promise.all([
        isDonor(address),
        getBalance()
      ]);
      
      setIsDonorStatus(donorStatus);
      setBalance(newBalance);
      setAmount('');
      
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(
        error.message.includes('insufficient funds')
          ? 'Insufficient USDC balance'
          : error.message.includes('user rejected')
          ? 'Transaction rejected by user'
          : 'Donation failed. Please try again.'
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
        getBalance()
      ]);
      setIsDonorStatus(donorStatus);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Format balance for display
  const formatBalance = (balance) => {
    return (Number(balance) / 1000000).toFixed(2);
  };

  // Format address for display
  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    if (address) {
      loadInitialData();
    }
  }, [address]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Make a Donation</h2>
        <p className="text-gray-600 mt-2">
          Support disaster relief efforts with your donation
        </p>
      </div>

      {!isConnected ? (
        <div className="text-center">
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isConnecting ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : (
              <>
                <FaWallet className="h-5 w-5" />
                Connect Coinbase Wallet
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Connected: {formatAddress(address)}
            </span>
            <button
              onClick={() => disconnect()}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Disconnect
            </button>
          </div>

          <form onSubmit={handleDonate} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (USDC)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">USDC</span>
                </div>
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

            <button
              type="submit"
              disabled={isLoading || !amount || Number(amount) <= 0}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || !amount || Number(amount) <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-5 w-5" />
              ) : (
                'Donate Now'
              )}
            </button>
          </form>
        </>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          By donating, you agree to our{' '}
          <a href="#" className="text-green-600 hover:text-green-700">
            terms and conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default DonateForm; 