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
  transport: custom(window.ethereum),
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
      address: DAO_CONTRACT_ADDRESS,
      abi: daoABI,
      walletClient,
      publicClient,
    };
  } catch (error) {
    console.error("Error initializing write contract:", error);
    throw error;
  }
};

// Admin functions
export const setDisasterReliefFactory = async (factoryAddress) => {
  try {
    const contract = await getWriteDaoContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'setDisasterReliefFactory',
      args: [factoryAddress],
      account: contract.address,
    });
    console.log("Set disaster relief factory transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in setDisasterReliefFactory:", error);
    throw new Error(`Failed to set disaster relief factory: ${error.message}`);
  }
};

export const setFundEscrow = async (fundEscrowAddress) => {
  try {
    const contract = await getWriteDaoContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'setFundEscrow',
      args: [fundEscrowAddress],
      account: contract.address,
    });
    console.log("Set fund escrow transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in setFundEscrow:", error);
    throw new Error(`Failed to set fund escrow: ${error.message}`);
  }
};

export const addDAOMember = async (memberAddress) => {
  try {
    const contract = await getWriteDaoContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'addDAOMember',
      args: [memberAddress],
      account: contract.address,
    });
    console.log("Add DAO member transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in addDAOMember:", error);
    throw new Error(`Failed to add DAO member: ${error.message}`);
  }
};

export const removeDAOMember = async (memberAddress) => {
  try {
    const contract = await getWriteDaoContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'removeDAOMember',
      args: [memberAddress],
      account: contract.address,
    });
    console.log("Remove DAO member transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in removeDAOMember:", error);
    throw new Error(`Failed to remove DAO member: ${error.message}`);
  }
};

// Proposal functions
export const createProposal = async (disasterName, location, fundAmount, image) => {
  try {
    const contract = await getWriteDaoContract();
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'createProposal',
      args: [disasterName, location, BigInt(fundAmount), image],
      account: contract.address,
    });
    console.log("Create proposal transaction submitted:", hash);
    return hash;
  } catch (error) {
    console.error("Error in createProposal:", error);
    throw new Error(`Failed to create proposal: ${error.message}`);
  }
};

export const vote = async (proposalId, support) => {
  try {
    const contract = await getWriteDaoContract();
    
    // Get the connected wallet address
    const [address] = await contract.walletClient.getAddresses();
    if (!address) {
      throw new Error("No wallet connected");
    }

    // Estimate gas for the transaction
    const gas = await contract.publicClient.estimateContractGas({
      address: contract.address,
      abi: contract.abi,
      functionName: 'vote',
      args: [BigInt(proposalId), support],
      account: address,
    });

    // Prepare the transaction with gas settings
    const transaction = {
      address: contract.address,
      abi: contract.abi,
      functionName: 'vote',
      args: [BigInt(proposalId), support],
      account: address,
      gas: gas,
      maxFeePerGas: 1000000000n, // 1 Gwei
      maxPriorityFeePerGas: 100000000n, // 0.1 Gwei
    };

    // Submit the vote transaction
    const hash = await contract.walletClient.writeContract(transaction);

    // Wait for transaction confirmation
    const receipt = await contract.publicClient.waitForTransactionReceipt({ hash });
    
    if (receipt.status === "success") {
      console.log("Vote transaction submitted successfully:", hash);
      return hash;
    } else {
      throw new Error("Vote transaction failed");
    }
  } catch (error) {
    console.error("Error in vote:", error);
    throw new Error(`Failed to vote: ${error.message}`);
  }
};

// Read functions
export const isAdmin = async (address) => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'isAdmin',
      args: [address],
    });
    return result;
  } catch (error) {
    console.error("Error in isAdmin:", error);
    throw new Error(`Failed to check admin status: ${error.message}`);
  }
};

export const isDAOMember = async (address) => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'isDAOMember',
      args: [address],
    });
    return result;
  } catch (error) {
    console.error("Error in isDAOMember:", error);
    throw new Error(`Failed to check DAO member status: ${error.message}`);
  }
};

export const getProposal = async (proposalId) => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getProposal',
      args: [BigInt(proposalId)],
    });
    return result;
  } catch (error) {
    console.error("Error in getProposal:", error);
    throw new Error(`Failed to get proposal: ${error.message}`);
  }
};

export const hasVoted = async (proposalId, voter) => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'hasVoted',
      args: [BigInt(proposalId), voter],
    });
    return result;
  } catch (error) {
    console.error("Error in hasVoted:", error);
    throw new Error(`Failed to check vote status: ${error.message}`);
  }
};

export const proposalCount = async () => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'proposalCount',
    });
    return result;
  } catch (error) {
    console.error("Error in proposalCount:", error);
    throw new Error(`Failed to get proposal count: ${error.message}`);
  }
};

export const memberCount = async () => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'memberCount',
    });
    return result;
  } catch (error) {
    console.error("Error in memberCount:", error);
    throw new Error(`Failed to get member count: ${error.message}`);
  }
};

export const getProposalStatus = async (proposalId) => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getProposalStatus',
      args: [BigInt(proposalId)],
    });
    return result;
  } catch (error) {
    console.error("Error in getProposalStatus:", error);
    throw new Error(`Failed to get proposal status: ${error.message}`);
  }
};

export const getDAOMembers = async () => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getDAOMembers',
    });
    return result;
  } catch (error) {
    console.error("Error in getDAOMembers:", error);
    throw new Error(`Failed to get DAO members: ${error.message}`);
  }
};

export const getVotingPeriod = async () => {
  try {
    const contract = getReadDaoContract();
    const result = await contract.publicClient.readContract({
      ...contract,
      functionName: 'votingPeriod',
    });
    return result;
  } catch (error) {
    console.error("Error in getVotingPeriod:", error);
    throw new Error(`Failed to get voting period: ${error.message}`);
  }
};