import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import disasterReliefABI from '../abis/disasterRelief.json'
import usdcABI from '../abis/ierc20.json'

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
export const getDisasterReliefContract = (address) => ({
  address,
  abi: disasterReliefABI,
});

// USDC contract configuration
export const getUSDCContract = (address) => ({
  address,
  abi: usdcABI,
});

// Read contract configuration
export const getReadDisasterReliefContract = (address) => ({
  publicClient,
  ...getDisasterReliefContract(address),
});

// Write contract configuration
export const getWriteDisasterReliefContract = async (address) => {
  try {
    if (!window.ethereum) {
      throw new Error("No wallet provider found. Please install a wallet like MetaMask.");
    }

    const [userAddress] = await walletClient.getAddresses();
    if (!userAddress) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    const chainId = await walletClient.getChainId();
    if (chainId !== baseSepolia.id) {
      throw new Error(`Please switch to the Base Sepolia network (chain ID: ${baseSepolia.id}).`);
    }

    return {
      address,
      abi: disasterReliefABI,
      walletClient,
      publicClient,
    };
  } catch (error) {
    console.error("Error initializing write contract:", error);
    throw error;
  }
};

// Approve USDC spending
export const approveUSDC = async (usdcAddress, spenderAddress, amount) => {
  try {
    const contract = {
      address: usdcAddress,
      abi: usdcABI,
      walletClient,
    };

    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'approve',
      args: [spenderAddress, BigInt(amount)],
      account: contract.address,
    });
    console.log("USDC approval transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in approveUSDC:", error);
    throw new Error(`Failed to approve USDC: ${error.message}`);
  }
};

// Disaster Relief functions
export const donate = async (contractAddress, usdcAddress, amount) => {
  try {
    // First approve the contract to spend USDC
    await approveUSDC(usdcAddress, contractAddress, amount);

    // Then proceed with donation
    const contract = await getWriteDisasterReliefContract(contractAddress);
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'donate',
      args: [BigInt(amount)],
      account: contract.address,
    });
    console.log("Donation transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in donate:", error);
    throw new Error(`Failed to donate: ${error.message}`);
  }
};

export const registerAsVictim = async (contractAddress, zkProof) => {
  try {
    const contract = await getWriteDisasterReliefContract(contractAddress);
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'registerAsVictim',
      args: [zkProof],
      account: contract.address,
    });
    console.log("Victim registration transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in registerAsVictim:", error);
    throw new Error(`Failed to register as victim: ${error.message}`);
  }
};

export const withdrawFunds = async (contractAddress) => {
  try {
    const contract = await getWriteDisasterReliefContract(contractAddress);
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'withdrawFunds',
      account: contract.address,
    });
    console.log("Withdraw funds transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in withdrawFunds:", error);
    throw new Error(`Failed to withdraw funds: ${error.message}`);
  }
};

// Read functions
export const getState = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getState',
    });
    return result;
  } catch (error) {
    console.error("Error in getState:", error);
    throw new Error(`Failed to get state: ${error.message}`);
  }
};

export const getTotalFunds = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getTotalFunds',
    });
    return result;
  } catch (error) {
    console.error("Error in getTotalFunds:", error);
    throw new Error(`Failed to get total funds: ${error.message}`);
  }
};

export const getDonorCount = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getDonorCount',
    });
    return result;
  } catch (error) {
    console.error("Error in getDonorCount:", error);
    throw new Error(`Failed to get donor count: ${error.message}`);
  }
};

export const getVictimCount = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getVictimCount',
    });
    return result;
  } catch (error) {
    console.error("Error in getVictimCount:", error);
    throw new Error(`Failed to get victim count: ${error.message}`);
  }
};

export const getLocationDetails = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getLocationDetails',
    });
    return result;
  } catch (error) {
    console.error("Error in getLocationDetails:", error);
    throw new Error(`Failed to get location details: ${error.message}`);
  }
};

export const isDonor = async (contractAddress, address) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'donors',
      args: [address],
    });
    return result;
  } catch (error) {
    console.error("Error in isDonor:", error);
    throw new Error(`Failed to check donor status: ${error.message}`);
  }
};

export const isVictim = async (contractAddress, address) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'victims',
      args: [address],
    });
    return result;
  } catch (error) {
    console.error("Error in isVictim:", error);
    throw new Error(`Failed to check victim status: ${error.message}`);
  }
};

export const hasWithdrawn = async (contractAddress, address) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'hasWithdrawn',
      args: [address],
    });
    return result;
  } catch (error) {
    console.error("Error in hasWithdrawn:", error);
    throw new Error(`Failed to check withdrawal status: ${error.message}`);
  }
}; 