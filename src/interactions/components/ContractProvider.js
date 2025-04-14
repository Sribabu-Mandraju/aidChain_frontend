"use client"

// React context provider for contract interactions
import { createContext, useContext, useEffect, useState } from "react"
import { useWalletClient } from "@coinbase/onchainkit"
import { ethers } from "ethers"
import { initializeProvider } from "../contracts/provider"

// Create context
const ContractContext = createContext(null)

/**
 * Provider component for contract interactions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ContractProvider({ children }) {
  const { walletClient } = useWalletClient()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (walletClient) {
      // Create ethers provider and signer from Coinbase onchainKit
      const provider = new ethers.providers.Web3Provider(walletClient)
      const signer = provider.getSigner()

      // Initialize contract provider
      initializeProvider(provider, signer)
      setIsInitialized(true)
    }
  }, [walletClient])

  return <ContractContext.Provider value={{ isInitialized }}>{children}</ContractContext.Provider>
}

/**
 * Hook to use contract context
 * @returns {Object} Contract context
 */
export function useContract() {
  const context = useContext(ContractContext)
  if (context === null) {
    throw new Error("useContract must be used within a ContractProvider")
  }
  return context
}
