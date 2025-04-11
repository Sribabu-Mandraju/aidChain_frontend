import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';
import { ConnectButton, lightTheme, useActiveAccount } from 'thirdweb/react';
import { client } from '../../hooks/client';
import { base } from 'thirdweb/chains'; // Assuming Base chain; adjust if needed

const ConnectWallet = () => {
  // Get the active account to check connection status
  const account = useActiveAccount();
  const address = account?.address || '';

  // State to store balance
  const [balance, setBalance] = useState(null);

  console.log('ConnectWallet: account:', account);
  console.log('ConnectWallet: address:', address);
//   console.log('ConnectWallet: balance:', balance);

  // Animation variants
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    pulse: {
      scale: [1, 1.03, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  // Custom light theme with navbar-matching styles
  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: 'linear-gradient(to right, #9333ea, #ec4899)', // Matches navbar gradient
      primaryButtonText: '#ffffff',
      secondaryButtonBg: '#f3e8ff',
      secondaryButtonText: '#4b5563',
      modalBg: '#ffffff',
      borderColor: '#e9d5ff',
      accentButtonBg: '#7c3aed',
      accentButtonText: '#ffffff',
    },
    radii: {
      md: '9999px', // Fully rounded corners
    },
    fontFamily: 'Inter, sans-serif',
  });

  return (
    <div className="flex justify-center">
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        while={!address ? 'pulse' : undefined}
      >
        <ConnectButton
          client={client}
          theme={customTheme}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base shadow-md"
          connectModal={{
            size: 'compact',
            title: 'Connect to Relief',
            showThirdwebBranding: false,
          }}
          detailsButton={{
            render: () => (
              <div className="relative group">
                {/* Connected Button */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-md hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                  <FaWallet className="text-lg" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="truncate max-w-[100px] sm:max-w-[120px] font-mono text-sm">
                      {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'No Wallet'}
                    </span>
                    {/* {balance && (
                      <span className="text-xs sm:text-sm opacity-80">
                        {parseFloat(balance.displayValue).toFixed(3)} {balance.symbol}
                      </span>
                    )} */}
                  </div>
                </div>
                {/* Tooltip/Dropdown */}
                {address && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 w-64 bg-white text-gray-700 text-sm rounded-lg shadow-xl border border-purple-100 p-4 z-10 hidden group-hover:block"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-mono text-xs break-all">
                        <strong>Address:</strong> {address}
                      </p>
                      <button
                        onClick={() => account?.disconnect?.()}
                        className="text-left text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ),
          }}
          connectButton={{
            label: (
              <div className="flex items-center gap-2">
                <FaWallet className="text-lg text-white" />
                Connect Wallet
              </div>
            ),
          }}
        />
      </motion.div>
    </div>
  );
};

export default ConnectWallet;