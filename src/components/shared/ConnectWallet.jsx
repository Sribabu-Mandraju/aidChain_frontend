import React from "react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
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

  // Minimal custom styles for Coinbase OnchainKit
  const customStyles = {
    "--ock-borderRadius": "9999px",
    "--ock-fontFamily": "Inter, sans-serif",
  };

  return (
    <div className="flex items-center gap-2">
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
        className="flex items-center"
      >
        {isConnected ? (
          <div className="flex items-center gap-2">
            {/* Connected Address Display */}
            <div
              style={{
                background: "white",
                border: "2px solid #22c55e",
                color: "#0052FF",
                borderRadius: "9999px",
                padding: "0.375rem 0.75rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              className="transition-all duration-300 hover:border-[#003bb5] hover:text-[#003bb5]"
              title={address}
            >
              <img
                src={WalletLogo}
                alt="Wallet Logo"
                style={{ width: "24px", height: "24px", display: "inline-block" }}
              />
              <span
                style={{ fontFamily: "monospace", maxWidth: "100px" }}
                className="truncate"
              >
                {address.slice(0, 4)}...{address.slice(-4)}
              </span>
            </div>
            {/* Disconnect Button */}
            <button
              onClick={() => disconnect()}
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                borderRadius: "9999px",
                padding: "0.25rem 0.625rem",
                fontSize: "0.75rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              className="transition-all duration-300 hover:bg-red-100"
            >
              <svg
                style={{ width: "16px", height: "16px" }}
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
          <div
            style={{
              background: "white",
              border: "2px solid #0052FF",
              borderRadius: "9999px",
              padding: "0.375rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#0052FF",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            className="transition-all duration-300 hover:border-[#003bb5] hover:text-[#003bb5]"
          >
            <ConnectWallet
              chainId={base.id}
              style={customStyles}
              className="flex items-center gap-2 bg-transparent"
            >
              <img
                src={WalletLogo}
                alt="Wallet Logo"
                style={{ width: "24px", height: "24px", display: "inline-block" }}
              />
              <span className="hidden sm:inline">Connect Wallet</span>
              <FaWallet className="text-lg sm:hidden" />
            </ConnectWallet>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectWalletComponent;