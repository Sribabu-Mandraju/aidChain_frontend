"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ConnectWallet } from "@coinbase/onchainkit/wallet"
import { useAccount, useDisconnect } from "wagmi"
import { base } from "wagmi/chains"

const WalletConnection = ({ isDarkMode, setCurrentStep, walletAddress, setWalletAddress, status, setStatus }) => {
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Handle wallet connection
  const handleWalletConnection = async () => {
    setIsConnectingWallet(true)
    setStatus("Connecting to Coinbase Smart Wallet...")

    try {
      if (isConnected && address) {
        setWalletAddress(address)
        setStatus("Wallet connected successfully!")
        console.log("Wallet connected:", address)
      } else {
        setStatus("Please connect your wallet using the Coinbase button")
      }
    } catch (error) {
      console.error("Wallet connection error:", error)
      setStatus("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnectingWallet(false)
    }
  }

  // Watch for wallet connection
  React.useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address)
      setStatus("Wallet connected successfully!")
    }
  }, [isConnected, address, setWalletAddress, setStatus])

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
          </svg>
          Connect Wallet
        </h2>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
          Connect your Coinbase Smart Wallet to begin the registration process
        </p>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
        } rounded-lg p-6 border mb-6`}
      >
        <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>Why Connect a Wallet?</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Receive aid directly to your wallet</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>No intermediaries or delays</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Secure and transparent distribution</span>
          </li>
        </ul>
      </div>

      {!walletAddress ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <ConnectWallet
              chainId={base.id}
              style={{
                "--ock-borderRadius": "9999px",
                "--ock-fontFamily": "Inter, sans-serif",
              }}
              className="w-full"
              onConnect={handleWalletConnection}
            />
          </div>
          <p className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Connect your wallet to continue
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-100"
            } rounded-lg p-4 border`}
          >
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500 mr-3 mt-1 flex-shrink-0"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Wallet Successfully Connected
                </h3>
                <div className="mt-2 bg-gray-800 p-3 rounded border border-gray-700 break-all">
                  <p className="text-xs text-gray-400 mb-1">Wallet Address:</p>
                  <p className="text-sm font-mono text-gray-300">{walletAddress}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentStep(2)}
            className={`w-full py-3 px-4 rounded-lg ${
              isDarkMode ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-800"
            } font-medium flex items-center justify-center`}
          >
            Continue to Verification
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.button>
        </div>
      )}

      {status && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            isDarkMode ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-50 text-gray-700 border-gray-200"
          } border`}
        >
          {status}
        </div>
      )}
    </div>
  )
}

export default WalletConnection
