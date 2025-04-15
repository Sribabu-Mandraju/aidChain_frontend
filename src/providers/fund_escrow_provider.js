import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import fundEscrowABI from '../abis/fundEscrow.json';
import erc20ABI from '../abis/ierc20.json'

// Minimal ERC-20 ABI for USDC approval


const FUND_ESCROW_CONTRACT_ADDRESS = "0xE9FEfb23Ae5382390c54697EFD9E9d4AC3Cf1bdF";

// Initialize public client for read operations
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Base contract configuration
const getFundEscrowContract = () => ({
  address: FUND_ESCROW_CONTRACT_ADDRESS,
  abi: fundEscrowABI,
});

// Read contract configuration
export const getReadFundEscrowContract = () => ({
  publicClient,
  ...getFundEscrowContract(),
});

// Write contract configuration
export const getWriteFundEscrowContract = async (walletClient) => {
  try {
    if (!walletClient) {
      throw new Error("No wallet client provided. Please connect your wallet.");
    }

    // Ensure wallet is connected and has an address
    const [userAddress] = await walletClient.getAddresses();
    if (!userAddress) {
      throw new Error("No account connected. Please connect your wallet.");
    }

    // Verify chain ID matches Base Sepolia
    const chainId = await walletClient.getChainId();
    if (chainId !== baseSepolia.id) {
      throw new Error(`Please switch to the Base Sepolia network (chain ID: ${baseSepolia.id}).`);
    }

    return {
      userAddress, // User's wallet address
      walletClient,
      publicClient,
      ...getFundEscrowContract(),
    };
  } catch (error) {
    console.error("Error initializing write contract:", error);
    throw error;
  }
};

// Check and request USDC approval
export const ensureUsdcApproval = async (walletClient, amountUsdc) => {
  try {
    const contract = await getWriteFundEscrowContract(walletClient);
    const usdcAddress = await getUsdcAddress();

    // Check current allowance
    const allowance = await publicClient.readContract({
      address: usdcAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [contract.userAddress, FUND_ESCROW_CONTRACT_ADDRESS],
    });

    if (BigInt(allowance) < BigInt(amountUsdc)) {
      console.log("Approving USDC for FundEscrow:", { amountUsdc, userAddress: contract.userAddress });
      const hash = await contract.walletClient.writeContract({
        address: usdcAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [FUND_ESCROW_CONTRACT_ADDRESS, BigInt(amountUsdc)],
        account: contract.userAddress, // Use user's wallet address
      });

      console.log("Approval transaction submitted:", hash);
      await publicClient.waitForTransactionReceipt({ hash });
      console.log("USDC approval confirmed");
    } else {
      console.log("Sufficient USDC allowance already exists");
    }
  } catch (error) {
    console.error("Error in ensureUsdcApproval:", error);
    throw new Error(`USDC approval failed: ${error.message}`);
  }
};

// Contract interaction functions
export const donate = async (amountUsdc, walletClient) => {
  try {
    const contract = await getWriteFundEscrowContract(walletClient);
    
    console.log("Preparing donation:", {
      contractAddress: contract.address,
      amountUsdc,
      sender: contract.userAddress,
      abiFunction: contract.abi.find((item) => item.name === 'donate'),
    });

    // Ensure USDC approval
    await ensureUsdcApproval(walletClient, amountUsdc);

    // Execute donate function (USDC with 6 decimals, single amount parameter)
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'donate',
      args: [BigInt(amountUsdc)], // Only amount, per function donate(uint256 amount)
      account: contract.userAddress, // Use user's wallet address
    });

    console.log("Transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in donate:", error);
    if (error.message.includes("Unknown Ethereum address")) {
      throw new Error("Your address is not recognized by the contract. Please register or contact support.");
    } else if (error.message.includes("ABI encoding")) {
      throw new Error("Contract function mismatch. Please check the donate function signature.");
    } else if (error.message.includes("user rejected")) {
      throw new Error("Transaction was rejected by the user.");
    } else if (error.message.includes("insufficient funds")) {
      throw new Error("Insufficient USDC balance in your wallet.");
    } else if (error.message.includes("network")) {
      throw new Error("Network error. Please check your connection and try again.");
    } else if (error.message.includes("SafeERC20")) {
      throw new Error("USDC transfer failed. Please ensure you have approved the contract.");
    } else {
      throw new Error(`Donation failed: ${error.message}`);
    }
  }
};

export const allocateFunds = async (reliefContract, amount, walletClient) => {
  try {
    const contract = await getWriteFundEscrowContract(walletClient);
    
    console.log("Preparing fund allocation:", {
      contractAddress: contract.address,
      reliefContract,
      amount,
      sender: contract.userAddress,
    });

    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'allocateFunds',
      args: [reliefContract, BigInt(amount)],
      account: contract.userAddress, // Use user's wallet address
    });

    console.log("Allocation transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in allocateFunds:", error);
    throw new Error(`Fund allocation failed: ${error.message}`);
  }
};

export const getBalance = async () => {
  try {
    const contract = getReadFundEscrowContract();
    const balance = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getBalance',
    });
    console.log(balance)
    return balance;
  } catch (error) {
    console.error('Error in getBalance:', error);
    throw error;
  }
};

export const isDonor = async (address) => {
  try {
    const contract = getReadFundEscrowContract();
    const isDonor = await contract.publicClient.readContract({
      ...contract,
      functionName: 'donors',
      args: [address],
    });
    return isDonor;
  } catch (error) {
    console.error('Error in isDonor:', error);
    throw error;
  }
};

export const getUsdcAddress = async () => {
  try {
    const contract = getReadFundEscrowContract();
    const usdcAddress = await contract.publicClient.readContract({
      ...contract,
      functionName: 'USDC',
    });
    return usdcAddress;
  } catch (error) {
    console.error('Error in getUsdcAddress:', error);
    throw error;
  }
};

export const getDaoGovernanceAddress = async () => {
  try {
    const contract = getReadFundEscrowContract();
    const daoAddress = await contract.publicClient.readContract({
      ...contract,
      functionName: 'daoGovernance',
    });
    return daoAddress;
  } catch (error) {
    console.error('Error in getDaoGovernanceAddress:', error);
    throw error;
  }
};

export const getDonorBadgeAddress = async () => {
  try {
    const contract = getReadFundEscrowContract();
    const badgeAddress = await contract.publicClient.readContract({
      ...contract,
      functionName: 'donorBadge',
    });
    return badgeAddress;
  } catch (error) {
    console.error('Error in getDonorBadgeAddress:', error);
    throw error;
  }
};

export const getFactoryAddress = async () => {
  try {
    const contract = getReadFundEscrowContract();
    const factoryAddress = await contract.publicClient.readContract({
      ...contract,
      functionName: 'factory',
    });
    return factoryAddress;
  } catch (error) {
    console.error('Error in getFactoryAddress:', error);
    throw error;
  }
};