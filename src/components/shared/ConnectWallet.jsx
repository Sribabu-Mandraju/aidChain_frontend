import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";

// Import your logo at the top
import WalletLogo from "../../assets/wallet/BaseLogo.png"; // Replace with your actual logo path, e.g., "../assets/wallet-logo.png"

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Minimal custom styles for Coinbase OnchainKit
  const customStyles = {
    "--ock-borderRadius": "9999px",
    "--ock-fontFamily": "Inter, sans-serif",
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <style jsx global>{`
        .ock-button, /* Targeting Coinbase OnchainKit button */
        .ock-button * {
          background: white !important;
          background-image: none !important;
          border: 2px solid #22c55e !important;
          color: #0052FF !important;
        }
        .ock-button:hover {
          border-color: #22c55e !important;
          color: #003bb5 !important;
        }
      `}</style>
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        while={!isConnected ? "pulse" : undefined}
      >
        {isConnected ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0052FF] rounded-full hover:bg-[#003bb5] transition-colors duration-200"
            >
              <img
                src={WalletLogo}
                alt="Wallet Logo"
                className="w-5 h-5"
              />
              <span className="font-mono">
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
              <FaChevronDown className="w-3 h-3" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <ConnectWallet
              chainId={base.id}
              style={customStyles}
              className="flex items-center gap-2 bg-transparent"
            >
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0052FF] rounded-full hover:bg-[#003bb5] transition-colors duration-200">
                <img
                  src={WalletLogo}
                  alt="Wallet Logo"
                  className="w-5 h-5"
                />
                <span className="hidden sm:inline">Connect Wallet</span>
                <FaWallet className="text-lg sm:hidden" />
              </div>
            </ConnectWallet>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectWalletComponent;