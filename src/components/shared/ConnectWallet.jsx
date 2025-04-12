"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';
import { ConnectButton, lightTheme, useActiveAccount, useDisconnect } from 'thirdweb/react';
import { client } from '../../hooks/client';
import { base } from 'thirdweb/chains';

const ConnectWallet = () => {
  const account = useActiveAccount();
  const address = account?.address || '';
  const { disconnect } = useDisconnect();

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

  // Custom theme matching the Campaigns component's palette
  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: 'linear-gradient(to right, #22c55e, #059669)', // Matches Campaigns' from-green-500 to-emerald-600
      primaryButtonText: '#ffffff',
      secondaryButtonBg: '#f0fdf4', // Matches Campaigns' green-50
      secondaryButtonText: '#4b5563',
      modalBg: '#ffffff',
      borderColor: '#d1fae5', // Matches Campaigns' green-100
      accentButtonBg: '#16a34a', // Matches Campaigns' green-600
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
          chain={base}
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
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-md hover:from-green-400 hover:to-emerald-500 transition-all duration-300">
                  <FaWallet className="text-lg" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="truncate max-w-[100px] sm:max-w-[120px] font-mono text-sm">
                      {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'No Wallet'}
                    </span>
                  </div>
                </div>
                {/* Tooltip/Dropdown */}
                {/* {address && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 w-64 bg-white text-gray-700 text-sm rounded-lg shadow-xl border border-green-100 p-4 z-10"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="font-mono text-xs break-all">
                        <strong>Address:</strong> {address}
                      </p>
                      <button
                        onClick={() => disconnect()}
                        className="text-left text-green-600 hover:text-green-800 font-semibold transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </motion.div>
                )} */}
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