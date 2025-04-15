import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import daoABI from '../abis/daoGovernance.json';
import fundEscrowABI from '../abis/fundEscrow.json';

const DAO_CONTRACT_ADDRESS = "0x1b105d0FcCF76aa7a5Aca51e1135DCC4F8Be2307";

// Initialize public client for read operations
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://base-sepolia.g.alchemy.com/v2/kBfhfjgaUbr1xz7I4QTPU7ZepOM6uMxK"),
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

// dao_provider.js
export const vote = async (proposalId, support) => {
  try {
    const contract = await getWriteDaoContract();

    // Get the connected wallet address
    const [address] = await contract.walletClient.getAddresses();
    if (!address) {
      throw new Error("No wallet connected");
    }

    // Check if user is a DAO member
    const isMember = await isDAOMember(address);
    if (!isMember) {
      throw new Error("Only DAO members can vote");
    }

    // Check if user has already voted
    const hasVotedAlready = await hasVoted(proposalId, address);
    if (hasVotedAlready) {
      throw new Error("You have already voted on this proposal");
    }

    // Get current proposal details
    const proposal = await getProposal(proposalId);
    if (!proposal) {
      throw new Error("Proposal not found");
    }

    // Check if proposal is still active
    if (proposal.state !== 0) {
      throw new Error("Proposal is not active");
    }

    // Check if voting period has ended
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > proposal.endTime) {
      throw new Error("Voting period has ended");
    }

    // Estimate gas (optional, for debugging)
    let gasEstimate;
    try {
      gasEstimate = await contract.publicClient.estimateContractGas({
        address: contract.address,
        abi: contract.abi,
        functionName: 'vote',
        args: [BigInt(proposalId), support],
        account: address,
      });
      console.log("Estimated gas:", gasEstimate.toString());
    } catch (gasError) {
      console.warn("Gas estimation failed:", gasError.message);
      // Fallback to a high gas limit
      gasEstimate = BigInt(5000000);
    }

    // Submit the vote transaction with a high gas limit
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'vote',
      args: [BigInt(proposalId), support],
      account: address,
      gas: gasEstimate + BigInt(100000), // Add a buffer to the estimated gas
      maxFeePerGas: BigInt(1000000000), // 1 gwei (adjust based on network conditions)
      maxPriorityFeePerGas: BigInt(100000000), // 0.1 gwei
    });

    console.log("Vote transaction submitted:", hash);

    return {
      hash,
      status: "success",
      message: "Vote submitted",
    };
  } catch (error) {
    console.error("Error in vote:", error);
    throw new Error(`Failed to vote: ${error.message}`);
  }
};

// Add a function to monitor proposal status
export const monitorProposalStatus = async (proposalId) => {
  try {
    const proposal = await getProposal(proposalId);
    if (!proposal) {
      throw new Error("Proposal not found");
    }

    const totalMembers = await memberCount();
    const requiredVotes = Math.ceil(Number(totalMembers) * 0.6);
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const votesFor = proposal.votesFor;
    const votesAgainst = proposal.votesAgainst;
    const proposalStatus = await getProposalStatus(proposalId);

    return {
      proposal,
      totalMembers,
      requiredVotes,
      totalVotes,
      votesFor,
      votesAgainst,
      proposalStatus,
      hasReachedThreshold: totalVotes >= requiredVotes,
      hasPassed: votesFor / totalVotes >= 0.6
    };
  } catch (error) {
    console.error("Error monitoring proposal status:", error);
    throw error;
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