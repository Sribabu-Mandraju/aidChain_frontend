// Provider file to initialize and export contract instances for reuse
import { ethers } from "ethers"
import { DAOGovernanceABI } from "./abis/DAOGovernanceABI"
import { DisasterReliefABI } from "./abis/DisasterReliefABI"
import { FundEscrowABI } from "./abis/FundEscrowABI"
import { DisasterReliefFactoryABI } from "./abis/DisasterReliefFactoryABI"
import { GeneralDonorBadgeABI } from "./abis/GeneralDonorBadgeABI"
import { DisasterDonorBadgeABI } from "./abis/DisasterDonorBadgeABI"

// Contract addresses (to be replaced with actual deployed addresses)
export const CONTRACT_ADDRESSES = {
  daoGovernance: "0x...",
  fundEscrow: "0x...",
  disasterReliefFactory: "0x...",
  generalDonorBadge: "0x...",
  disasterDonorBadge: "0x...",
  usdc: "0x...", // USDC token address
}

// Contract instances
let daoGovernance
let fundEscrow
let disasterReliefFactory
let generalDonorBadge
let disasterDonorBadge
let usdc

// Provider and signer
let provider
let signer

/**
 * Initialize the provider with Web3 provider and signer
 * @param {ethers.providers.Web3Provider} _provider - Web3 provider
 * @param {ethers.Signer} _signer - Web3 signer
 */
export function initializeProvider(_provider, _signer) {
  provider = _provider
  signer = _signer

  // Initialize contract instances
  daoGovernance = new ethers.Contract(CONTRACT_ADDRESSES.daoGovernance, DAOGovernanceABI, signer)
  fundEscrow = new ethers.Contract(CONTRACT_ADDRESSES.fundEscrow, FundEscrowABI, signer)
  disasterReliefFactory = new ethers.Contract(
    CONTRACT_ADDRESSES.disasterReliefFactory,
    DisasterReliefFactoryABI,
    signer,
  )
  generalDonorBadge = new ethers.Contract(CONTRACT_ADDRESSES.generalDonorBadge, GeneralDonorBadgeABI, signer)
  disasterDonorBadge = new ethers.Contract(CONTRACT_ADDRESSES.disasterDonorBadge, DisasterDonorBadgeABI, signer)
  usdc = new ethers.Contract(CONTRACT_ADDRESSES.usdc, ["function approve(address spender, uint256 amount)"], signer)
}

/**
 * Get contract instances
 * @returns {Object} Object containing all contract instances
 */
export function getContracts() {
  if (!provider || !signer) {
    throw new Error("Provider not initialized. Call initializeProvider first.")
  }

  return {
    daoGovernance,
    fundEscrow,
    disasterReliefFactory,
    generalDonorBadge,
    disasterDonorBadge,
    usdc,
    provider,
    signer,
  }
}

/**
 * Create a new contract instance for a specific disaster relief campaign
 * @param {string} reliefAddress - Address of the disaster relief contract
 * @returns {ethers.Contract} Disaster relief contract instance
 */
export function getReliefContract(reliefAddress) {
  if (!signer) {
    throw new Error("Provider not initialized. Call initializeProvider first.")
  }

  return new ethers.Contract(reliefAddress, DisasterReliefABI, signer)
}
getEscrowBalance