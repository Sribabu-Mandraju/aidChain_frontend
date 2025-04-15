import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import disasterReliefFactoryABI from '../abis/disasterReliefFactory.json';

const DISASTER_RELIEF_FACTORY_ADDRESS = "0x6F2dA9b816F80811A4dA21e511cb6235167a33Af";

// Initialize public client for read operations
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Initialize wallet client for write operations
export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum),
});

// Base contract configuration
export const getDisasterReliefFactoryContract = () => ({
  address: DISASTER_RELIEF_FACTORY_ADDRESS,
  abi: disasterReliefFactoryABI,
});

// Read contract configuration
export const getReadDisasterReliefFactoryContract = () => ({
  publicClient,
  ...getDisasterReliefFactoryContract(),
});

// Write contract configuration
export const getWriteDisasterReliefFactoryContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("No wallet provider found. Please install a wallet like MetaMask.");
    }

    const [address] = await walletClient.getAddresses();
    if (!address) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    const chainId = await walletClient.getChainId();
    if (chainId !== baseSepolia.id) {
      throw new Error(`Please switch to the Base Sepolia network (chain ID: ${baseSepolia.id}).`);
    }

    return {
      address: DISASTER_RELIEF_FACTORY_ADDRESS,
      abi: disasterReliefFactoryABI,
      walletClient,
      publicClient,
    };
  } catch (error) {
    console.error("Error initializing write contract:", error);
    throw error;
  }
};

// Factory functions
export const deployDisasterRelief = async (
  disasterName,
  location,
  donationPeriod,
  registrationPeriod,
  waitingPeriod,
  distributionPeriod,
  initialFunds
) => {
  try {
    const contract = await getWriteDisasterReliefFactoryContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'deployDisasterRelief',
      args: [
        disasterName,
        location,
        BigInt(donationPeriod),
        BigInt(registrationPeriod),
        BigInt(waitingPeriod),
        BigInt(distributionPeriod),
        BigInt(initialFunds)
      ],
      account: contract.address,
    });
    console.log("Deploy disaster relief transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in deployDisasterRelief:", error);
    throw new Error(`Failed to deploy disaster relief: ${error.message}`);
  }
};

export const setZKVerifier = async (zkVerifierAddress) => {
  try {
    const contract = await getWriteDisasterReliefFactoryContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'setZKVerifier',
      args: [zkVerifierAddress],
      account: contract.address,
    });
    console.log("Set ZK verifier transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in setZKVerifier:", error);
    throw new Error(`Failed to set ZK verifier: ${error.message}`);
  }
};

// Read functions
export const isDisasterRelief = async (address) => {
  try {
    const contract = getReadDisasterReliefFactoryContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'isDisasterRelief',
      args: [address],
    });
    return result;
  } catch (error) {
    console.error("Error in isDisasterRelief:", error);
    throw new Error(`Failed to check disaster relief status: ${error.message}`);
  }
};

export const getDisasterReliefContract = async (index) => {
  try {
    const contract = getReadDisasterReliefFactoryContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getProposal',
      args: [BigInt(index)],
    });
    return result;
  } catch (error) {
    console.error("Error in getDisasterReliefContract:", error);
    throw new Error(`Failed to get disaster relief contract: ${error.message}`);
  }
};

export const getAllDisasterReliefContracts = async () => {
  try {
    console.log("Fetching all disaster relief contracts...");
    const contract = getReadDisasterReliefFactoryContract();
    
    // Call getAllProposals directly
    const contracts = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getAllProposals',
      args: [],
    });
    
    console.log("Fetched contracts:", contracts);
    return contracts;
  } catch (error) {
    console.error("Error in getAllDisasterReliefContracts:", error);
    throw new Error(`Failed to get all disaster relief contracts: ${error.message}`);
  }
}; 