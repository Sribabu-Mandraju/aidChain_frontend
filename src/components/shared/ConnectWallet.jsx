import React from "react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";

// Coinbase Smart Wallet logo (SVG as inline JSX for simplicity)
// Replace with an actual logo URL or local asset if available
const CoinbaseSmartWalletLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 4v4H7v2h4v4h2v-4h4v-2h-4V6h-2z"
      fill="#0052FF"
    />
  </svg>
);

// Animation variants
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  pulse: {
    scale: [1, 1.03, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

const ConnectWalletComponent = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Custom styles for Coinbase OnchainKit button
  const customStyles = {
    "--ock-accentColor": "#ffffff",
    "--ock-accentBackground": "linear-gradient(to right, #0052FF, #22c55e)", // Coinbase blue to your green
    "--ock-backgroundColor": "#ffffff",
    "--ock-borderColor": "#bfdbfe", // Light blue for Coinbase branding
    "--ock-secondaryBackground": "#eff6ff", // Blue-50 equivalent
    "--ock-secondaryColor": "#1e3a8a", // Dark blue for text
    "--ock-borderRadius": "9999px",
    "--ock-fontFamily": "Inter, sans-serif",
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        while={!isConnected ? "pulse" : undefined}
        className="flex items-center"
      >
        {isConnected ? (
          <div className="flex items-center gap-2">
            {/* Connected Address Display */}
            <div
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm hover:from-blue-500 hover:to-green-400 transition-all duration-300"
              title={address} // Full address on hover
            >
              <CoinbaseSmartWalletLogo />
              <span className="font-mono truncate max-w-[80px] sm:max-w-[100px]">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
            </div>
            {/* Disconnect Button */}
            <button
              onClick={() => disconnect()}
              className="flex items-center gap-1 bg-red-50 text-red-600 rounded-full px-2.5 py-1 text-xs font-semibold hover:bg-red-100 transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Disconnect
            </button>
          </div>
        ) : (
          <ConnectWallet
            chainId={base.id}
            style={customStyles}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold shadow-sm"
          >
            <CoinbaseSmartWalletLogo />
            <span className="hidden sm:inline">Connect Wallet</span>
            <FaWallet className="text-lg sm:hidden" /> {/* Icon-only on mobile */}
          </ConnectWallet>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectWalletComponent;