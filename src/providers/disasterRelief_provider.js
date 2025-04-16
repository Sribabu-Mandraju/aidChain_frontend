import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import disasterReliefABI from '../abis/disasterRelief.json';
import usdcABI from '../abis/ierc20.json';

// Initialize public client for read operations
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
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
export const getWriteDisasterReliefContract = async (address, walletClient) => {
  try {
    if (!walletClient) {
      throw new Error("No wallet client provided. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    if (!accounts || accounts.length === 0) {
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
      account: accounts[0],
    };
  } catch (error) {
    console.error("Error initializing write contract:", error);
    throw error;
  }
};

// Approve USDC spending
export const approveUSDC = async (walletClient, usdcAddress, spenderAddress, amount) => {
  try {
    if (!walletClient) {
      throw new Error("No wallet client provided. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    if (!accounts || accounts.length === 0) {
      throw new Error("No account connected for USDC approval.");
    }

    // First check if approval is needed
    const currentAllowance = await publicClient.readContract({
      address: usdcAddress,
      abi: [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" }
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function"
        }
      ],
      functionName: "allowance",
      args: [accounts[0], spenderAddress]
    });

    // If current allowance is sufficient, no need to approve
    if (BigInt(currentAllowance) >= BigInt(amount)) {
      return null;
    }

    // Estimate gas for approval
    const gasEstimate = await publicClient.estimateContractGas({
      address: usdcAddress,
      abi: usdcABI,
      functionName: "approve",
      args: [spenderAddress, BigInt(amount)],
      account: accounts[0]
    });

    const contract = getUSDCContract(usdcAddress);
    const hash = await walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'approve',
      args: [spenderAddress, BigInt(amount)],
      account: accounts[0],
      gas: gasEstimate
    });
    console.log("USDC approval transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in approveUSDC:", error);
    if (error.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds for gas fee");
    }
    if (error.message.includes("user rejected")) {
      throw new Error("Transaction rejected by user");
    }
    throw new Error(`Failed to approve USDC: ${error.message}`);
  }
};

// Ensure USDC approval for campaign donation
export const ensureUsdcApproval = async (walletClient, usdcAddress, campaignAddress, amount) => {
  try {
    if (!walletClient) {
      throw new Error("No wallet client provided. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    if (!accounts || accounts.length === 0) {
      throw new Error("No account connected for USDC approval.");
    }

    // Check current allowance
    const allowance = await publicClient.readContract({
      address: usdcAddress,
      abi: [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" }
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function"
        }
      ],
      functionName: "allowance",
      args: [accounts[0], campaignAddress]
    });

    if (BigInt(allowance) < BigInt(amount)) {
      console.log("Approving USDC for campaign:", { amount, userAddress: accounts[0] });
      const hash = await approveUSDC(walletClient, usdcAddress, campaignAddress, amount);
      if (hash) {
        await publicClient.waitForTransactionReceipt({ hash });
        console.log("USDC approval confirmed");
      }
    } else {
      console.log("Sufficient USDC allowance already exists");
    }
  } catch (error) {
    console.error("Error in ensureUsdcApproval:", error);
    throw new Error(`USDC approval failed: ${error.message}`);
  }
};

// Get USDC balance
export const getUSDCBalance = async (usdcAddress, userAddress) => {
  try {
    if (!userAddress) {
      throw new Error("No user address provided.");
    }
    const contract = getUSDCContract(usdcAddress);
    const balance = await publicClient.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'balanceOf',
      args: [userAddress],
    });
    return balance;
  } catch (error) {
    console.error("Error in getUSDCBalance:", error);
    return BigInt(0); // Return 0 balance on error to prevent UI blocking
  }
};

// Disaster Relief functions
export const donate = async (contractAddress, usdcAddress, amount, walletClient) => {
  try {
    if (!walletClient) {
      throw new Error("No wallet client provided. Please connect your wallet.");
    }

    const accounts = await walletClient.getAddresses();
    if (!accounts || accounts.length === 0) {
      throw new Error("No account connected for donation.");
    }

    // Check if user has sufficient USDC balance
    const balance = await getUSDCBalance(usdcAddress, accounts[0]);
    if (BigInt(balance) < BigInt(amount)) {
      throw new Error("Insufficient USDC balance");
    }

    // Ensure USDC approval
    await ensureUsdcApproval(walletClient, usdcAddress, contractAddress, amount);

    // Estimate gas for donation
    const gasEstimate = await publicClient.estimateContractGas({
      address: contractAddress,
      abi: disasterReliefABI,
      functionName: 'donate',
      args: [BigInt(amount)],
      account: accounts[0]
    });

    // Then proceed with donation
    const contract = await getWriteDisasterReliefContract(contractAddress, walletClient);
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'donate',
      args: [BigInt(amount)],
      account: contract.account,
      gas: gasEstimate
    });
    console.log("Donation transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in donate:", error);
    if (error.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds for gas fee");
    }
    if (error.message.includes("user rejected")) {
      throw new Error("Transaction rejected by user");
    }
    if (error.message.includes("SafeERC20")) {
      throw new Error("USDC transfer failed. Please approve the contract first.");
    }
    throw new Error(`Failed to donate: ${error.message}`);
  }
};

export const registerAsVictim = async (contractAddress, zkProof, walletClient) => {
  try {
    const contract = await getWriteDisasterReliefContract(contractAddress, walletClient);
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'registerAsVictim',
      args: [zkProof],
      account: contract.account,
    });
    console.log("Victim registration transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in registerAsVictim:", error);
    throw new Error(`Failed to register as victim: ${error.message}`);
  }
};

export const withdrawFunds = async (contractAddress, walletClient) => {
  try {
    const contract = await getWriteDisasterReliefContract(contractAddress, walletClient);
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'withdrawFunds',
      account: contract.account,
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

export const getDisasterName = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'disasterName',
    });
    return result;
  } catch (error) {
    console.error("Error in getDisasterName:", error);
    throw new Error(`Failed to get disaster name: ${error.message}`);
  }
};

export const getDonationEndTime = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'donationEndTime',
    });
    return result;
  } catch (error) {
    console.error("Error in getDonationEndTime:", error);
    throw new Error(`Failed to get donation end time: ${error.message}`);
  }
};

export const getAmountPerVictim = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'amountPerVictim',
    });
    return result;
  } catch (error) {
    console.error("Error in getAmountPerVictim:", error);
    throw new Error(`Failed to get amount per victim: ${error.message}`);
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

// Add this new function after the other read functions
export const getCampaignDetails = async (contractAddress) => {
  try {
    const contract = getReadDisasterReliefContract(contractAddress);
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getCampaginDetails',
    });

    // Transform the returned data into a more usable format
    // The contract returns a DisasterDetails struct with the following fields:
    // - disasterId: uint256
    // - disasterName: string
    // - image: string
    // - location: LocationDetails.Location
    // - totalFunds: uint256
    // - totalDonors: uint256
    // - totalVictimsRegistered: uint256
    // - state: ContractState
    return {
      disasterId: Number(result.disasterId),
      disasterName: result.disasterName,
      image: result.image,
      location: {
        country: result.location.country,
        state: result.location.state,
        city: result.location.city,
        latitude: result.location.latitude,
        longitude: result.location.longitude,
        radius: result.location.radius,
        image: result.location.image
      },
      totalFunds: result.totalFunds,
      totalDonors: Number(result.totalDonors),
      totalVictimsRegistered: Number(result.totalVictimsRegistered),
      state: Number(result.state)
    };
  } catch (error) {
    console.error("Error in getCampaignDetails:", error);
    throw new Error(`Failed to get campaign details: ${error.message}`);
  }
};