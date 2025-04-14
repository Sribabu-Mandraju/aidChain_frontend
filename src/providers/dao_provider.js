import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import daoABI from '../abis/daoGovernance.json';

const DAO_CONTRACT_ADDRESS = "0x1b105d0FcCF76aa7a5Aca51e1135DCC4F8Be2307";

// Initialize public client for read operations
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Initialize wallet client for write operations
export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(typeof window !== 'undefined' ? window.ethereum : {}),
});

// Base contract configuration
export const getDaoContract = () => ({
  address: DAO_CONTRACT_ADDRESS,
  abi: daoABI,
});

// Read contract configuration
export const getReadDaoContract = () => ({
  publicClient,
  ...getDaoContract(),
});

// Write contract configuration
export const getWriteDaoContract = async () => {
  if (!window.ethereum) {
    throw new Error("No wallet provider found");
  }
  const [address] = await walletClient.getAddresses();
  if (!address) {
    throw new Error("No account connected");
  }
  return {
    address,
    walletClient,
    publicClient, // Ensure publicClient is included for read operations
    ...getDaoContract(),
  };
};
