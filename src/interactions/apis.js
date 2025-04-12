// contractController.js
import { ethers } from 'ethers';

// Contract addresses (replace with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  DAOGovernance: '0xYourDAOGovernanceAddress',
  DisasterReliefFactory: '0xYourDisasterReliefFactoryAddress',
  FundEscrow: '0xYourFundEscrowAddress',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
};

// ABIs (assumed to be imported)
const ABIs = {
  DAOGovernance: DAOGovernanceABI,
  DisasterRelief: DisasterReliefABI,
  DisasterReliefFactory: DisasterReliefFactoryABI,
  FundEscrow: FundEscrowABI,
  DisasterDonorBadge: DisasterDonorBadgeABI,
  GeneralDonorBadge: GeneralDonorBadgeABI,
  IERC20: IERC20ABI,
};

// Utility function to initialize provider and signer
async function getProviderAndSigner() {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
}

// Utility function to get contract instance
function getContract(address, abi, signerOrProvider) {
  return new ethers.Contract(address, abi, signerOrProvider);
}

/**
 * Approve USDC spending for a contract
 * @param {string} spender - Address of the contract to approve (e.g., FundEscrow or DisasterRelief)
 * @param {string} amount - Amount to approve (in USDC, 6 decimals)
 * @returns {Promise<string>} - Transaction hash
 */
async function approveUSDC(spender, amount) {
  try {
    const { signer } = await getProviderAndSigner();
    const usdcContract = getContract(CONTRACT_ADDRESSES.USDC, ABIs.IERC20, signer);
    const tx = await usdcContract.approve(spender, ethers.parseUnits(amount, 6));
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error approving USDC:', error);
    throw error;
  }
}

// DAOGovernance Functions

/**
 * Check if an address is an admin
 * @param {string} adminAddress - Address to check
 * @returns {Promise<boolean>} - True if admin, false otherwise
 */
async function isAdmin(adminAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, provider);
    return await daoContract.isAdmin(adminAddress);
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw error;
  }
}

/**
 * Check if an address is a DAO member
 * @param {string} memberAddress - Address to check
 * @returns {Promise<boolean>} - True if DAO member, false otherwise
 */
async function isDAOMember(memberAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, provider);
    return await daoContract.isDAOMember(memberAddress);
  } catch (error) {
    console.error('Error checking DAO member status:', error);
    throw error;
  }
}

/**
 * Add a new DAO member (admin only)
 * @param {string} memberAddress - Address to add as DAO member
 * @returns {Promise<string>} - Transaction hash
 */
async function addDAOMember(memberAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, signer);
    const tx = await daoContract.addDAOMember(memberAddress);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error adding DAO member:', error);
    throw error;
  }
}

/**
 * Remove a DAO member (admin only)
 * @param {string} memberAddress - Address to remove
 * @returns {Promise<string>} - Transaction hash
 */
async function removeDAOMember(memberAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, signer);
    const tx = await daoContract.removeDAOMember(memberAddress);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error removing DAO member:', error);
    throw error;
  }
}

/**
 * Create a new proposal (DAO member only)
 * @param {string} disasterName - Name of the disaster
 * @param {string} area - Affected area
 * @param {number} duration - Duration in seconds
 * @param {string} fundsRequested - Funds requested (in USDC, 6 decimals)
 * @param {string} image - URL or IPFS hash for proposal image
 * @returns {Promise<string>} - Transaction hash
 */
async function createProposal(disasterName, area, duration, fundsRequested, image) {
  try {
    const { signer } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, signer);
    const tx = await daoContract.createProposal(
      disasterName,
      area,
      duration,
      ethers.parseUnits(fundsRequested, 6),
      image
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
}

/**
 * Vote on a proposal (DAO member only)
 * @param {number} proposalId - ID of the proposal
 * @param {boolean} support - True to vote for, false to vote against
 * @returns {Promise<string>} - Transaction hash
 */
async function vote(proposalId, support) {
  try {
    const { signer } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, signer);
    const tx = await daoContract.vote(proposalId, support);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error voting on proposal:', error);
    throw error;
  }
}

/**
 * Check if an address has voted on a proposal
 * @param {number} proposalId - ID of the proposal
 * @param {string} voter - Address of the voter
 * @returns {Promise<boolean>} - True if voted, false otherwise
 */
async function hasVoted(proposalId, voter) {
  try {
    const { provider } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, provider);
    return await daoContract.hasVoted(proposalId, voter);
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw error;
  }
}

/**
 * Get proposal details
 * @param {number} proposalId - ID of the proposal
 * @returns {Promise<object>} - Proposal details
 */
async function getProposal(proposalId) {
  try {
    const { provider } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, provider);
    const proposal = await daoContract.getProposal(proposalId);
    return {
      id: Number(proposal.id),
      proposer: proposal.proposer,
      disasterName: proposal.disasterName,
      area: proposal.area,
      duration: Number(proposal.duration),
      fundsRequested: ethers.formatUnits(proposal.fundsRequested, 6),
      startTime: Number(proposal.startTime),
      endTime: Number(proposal.endTime),
      forVotes: Number(proposal.forVotes),
      againstVotes: Number(proposal.againstVotes),
      image: proposal.image,
      state: Number(proposal.state), // 0: Active, 1: Passed, 2: Rejected
    };
  } catch (error) {
    console.error('Error fetching proposal:', error);
    throw error;
  }
}

/**
 * Get total number of proposals
 * @returns {Promise<number>} - Number of proposals
 */
async function getProposalCount() {
  try {
    const { provider } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, provider);
    return Number(await daoContract.proposalCount());
  } catch (error) {
    console.error('Error fetching proposal count:', error);
    throw error;
  }
}

/**
 * Get total number of DAO members
 * @returns {Promise<number>} - Number of members
 */
async function getMemberCount() {
  try {
    const { provider } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, provider);
    return Number(await daoContract.memberCount());
  } catch (error) {
    console.error('Error fetching member count:', error);
    throw error;
  }
}

/**
 * Set DisasterReliefFactory address (admin only)
 * @param {string} factoryAddress - Address of the DisasterReliefFactory
 * @returns {Promise<string>} - Transaction hash
 */
async function setDisasterReliefFactory(factoryAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, signer);
    const tx = await daoContract.setDisasterReliefFactory(factoryAddress);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error setting factory:', error);
    throw error;
  }
}

/**
 * Set FundEscrow address (admin only)
 * @param {string} fundEscrowAddress - Address of the FundEscrow
 * @returns {Promise<string>} - Transaction hash
 */
async function setFundEscrow(fundEscrowAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const daoContract = getContract(CONTRACT_ADDRESSES.DAOGovernance, ABIs.DAOGovernance, signer);
    const tx = await daoContract.setFundEscrow(fundEscrowAddress);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error setting fund escrow:', error);
    throw error;
  }
}

// DisasterRelief Functions

/**
 * Donate to a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @param {string} amount - Amount to donate (in USDC, 6 decimals)
 * @returns {Promise<string>} - Transaction hash
 */
async function donateToRelief(reliefAddress, amount) {
  try {
    const { signer } = await getProviderAndSigner();
    // Approve USDC spending
    await approveUSDC(reliefAddress, amount);
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, signer);
    const tx = await reliefContract.donate(ethers.parseUnits(amount, 6));
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error donating to relief:', error);
    throw error;
  }
}

/**
 * Register as a victim in a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @param {string} zkProof - Zero-knowledge proof (hex string)
 * @returns {Promise<string>} - Transaction hash
 */
async function registerAsVictim(reliefAddress, zkProof) {
  try {
    const { signer } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, signer);
    const tx = await reliefContract.registerAsVictim(zkProof);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error registering as victim:', error);
    throw error;
  }
}

/**
 * Withdraw funds from a DisasterRelief contract (victims only)
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @returns {Promise<string>} - Transaction hash
 */
async function withdrawFunds(reliefAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, signer);
    const tx = await reliefContract.withdrawFunds();
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    throw error;
  }
}

/**
 * Update the state of a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @returns {Promise<string>} - Transaction hash
 */
async function updateReliefState(reliefAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, signer);
    const tx = await reliefContract.updateState();
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error updating relief state:', error);
    throw error;
  }
}

/**
 * Get the current state of a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @returns {Promise<number>} - State (0: Donation, 1: Registration, 2: Distribution, 3: Closed)
 */
async function getReliefState(reliefAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, provider);
    return Number(await reliefContract.getState());
  } catch (error) {
    console.error('Error fetching relief state:', error);
    throw error;
  }
}

/**
 * Get total funds in a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @returns {Promise<string>} - Total funds (in USDC, 6 decimals)
 */
async function getTotalFunds(reliefAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, provider);
    return ethers.formatUnits(await reliefContract.getTotalFunds(), 6);
  } catch (error) {
    console.error('Error fetching total funds:', error);
    throw error;
  }
}

/**
 * Get total number of donors in a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @returns {Promise<number>} - Number of donors
 */
async function getDonorCount(reliefAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, provider);
    return Number(await reliefContract.getDonorCount());
  } catch (error) {
    console.error('Error fetching donor count:', error);
    throw error;
  }
}

/**
 * Get total number of victims in a DisasterRelief contract
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @returns {Promise<number>} - Number of victims
 */
async function getVictimCount(reliefAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const reliefContract = getContract(reliefAddress, ABIs.DisasterRelief, provider);
    return Number(await reliefContract.getVictimCount());
  } catch (error) {
    console.error('Error fetching victim count:', error);
    throw error;
  }
}

// DisasterReliefFactory Functions

/**
 * Deploy a new DisasterRelief contract (DAO only)
 * @param {string} disasterName - Name of the disaster
 * @param {string} area - Affected area
 * @param {number} donationPeriod - Donation period in seconds
 * @param {number} registrationPeriod - Registration period in seconds
 * @param {number} waitingPeriod - Waiting period in seconds
 * @param {number} distributionPeriod - Distribution period in seconds
 * @param {string} initialFunds - Initial funds (in USDC, 6 decimals)
 * @returns {Promise<string>} - Transaction hash
 */
async function deployDisasterRelief(
  disasterName,
  area,
  donationPeriod,
  registrationPeriod,
  waitingPeriod,
  distributionPeriod,
  initialFunds
) {
  try {
    const { signer } = await getProviderAndSigner();
    const factoryContract = getContract(
      CONTRACT_ADDRESSES.DisasterReliefFactory,
      ABIs.DisasterReliefFactory,
      signer
    );
    const tx = await factoryContract.deployDisasterRelief(
      disasterName,
      area,
      donationPeriod,
      registrationPeriod,
      waitingPeriod,
      distributionPeriod,
      ethers.parseUnits(initialFunds, 6)
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error deploying disaster relief:', error);
    throw error;
  }
}

/**
 * Check if an address is a valid DisasterRelief contract
 * @param {string} reliefAddress - Address to check
 * @returns {Promise<boolean>} - True if valid, false otherwise
 */
async function isDisasterRelief(reliefAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const factoryContract = getContract(
      CONTRACT_ADDRESSES.DisasterReliefFactory,
      ABIs.DisasterReliefFactory,
      provider
    );
    return await factoryContract.isDisasterRelief(reliefAddress);
  } catch (error) {
    console.error('Error checking disaster relief:', error);
    throw error;
  }
}

/**
 * Set DAOGovernance address in DisasterReliefFactory (owner only)
 * @param {string} daoGovAddress - Address of the DAOGovernance contract
 * @returns {Promise<string>} - Transaction hash
 */
async function setDAOGovernance(daoGovAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const factoryContract = getContract(
      CONTRACT_ADDRESSES.DisasterReliefFactory,
      ABIs.DisasterReliefFactory,
      signer
    );
    const tx = await factoryContract.setDAOGovernance(daoGovAddress);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error setting DAO governance:', error);
    throw error;
  }
}

/**
 * Set ZKVerifier address in DisasterReliefFactory (owner only)
 * @param {string} zkVerifierAddress - Address of the ZKVerifier contract
 * @returns {Promise<string>} - Transaction hash
 */
async function setZKVerifier(zkVerifierAddress) {
  try {
    const { signer } = await getProviderAndSigner();
    const factoryContract = getContract(
      CONTRACT_ADDRESSES.DisasterReliefFactory,
      ABIs.DisasterReliefFactory,
      signer
    );
    const tx = await factoryContract.setZKVerifier(zkVerifierAddress);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error setting ZK verifier:', error);
    throw error;
  }
}

// FundEscrow Functions

/**
 * Donate to the FundEscrow contract
 * @param {string} amount - Amount to donate (in USDC, 6 decimals)
 * @returns {Promise<string>} - Transaction hash
 */
async function donateToEscrow(amount) {
  try {
    const { signer } = await getProviderAndSigner();
    // Approve USDC spending
    await approveUSDC(CONTRACT_ADDRESSES.FundEscrow, amount);
    const escrowContract = getContract(CONTRACT_ADDRESSES.FundEscrow, ABIs.FundEscrow, signer);
    const tx = await escrowContract.donate(ethers.parseUnits(amount, 6));
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error donating to escrow:', error);
    throw error;
  }
}

/**
 * Allocate funds from FundEscrow to a DisasterRelief contract (DAO only)
 * @param {string} reliefAddress - Address of the DisasterRelief contract
 * @param {string} amount - Amount to allocate (in USDC, 6 decimals)
 * @returns {Promise<string>} - Transaction hash
 */
async function allocateFunds(reliefAddress, amount) {
  try {
    const { signer } = await getProviderAndSigner();
    const escrowContract = getContract(CONTRACT_ADDRESSES.FundEscrow, ABIs.FundEscrow, signer);
    const tx = await escrowContract.allocateFunds(reliefAddress, ethers.parseUnits(amount, 6));
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error allocating funds:', error);
    throw error;
  }
}

/**
 * Get the balance of the FundEscrow contract
 * @returns {Promise<string>} - Balance (in USDC, 6 decimals)
 */
async function getEscrowBalance() {
  try {
    const { provider } = await getProviderAndSigner();
    const escrowContract = getContract(CONTRACT_ADDRESSES.FundEscrow, ABIs.FundEscrow, provider);
    return ethers.formatUnits(await escrowContract.getBalance(), 6);
  } catch (error) {
    console.error('Error fetching escrow balance:', error);
    throw error;
  }
}

// NFT Badge Functions (DisasterDonorBadge and GeneralDonorBadge)

/**
 * Mint a DisasterDonorBadge (owner only)
 * @param {string} badgeAddress - Address of the DisasterDonorBadge contract
 * @param {string} to - Recipient address
 * @returns {Promise<string>} - Transaction hash
 */
async function mintDisasterDonorBadge(badgeAddress, to) {
  try {
    const { signer } = await getProviderAndSigner();
    const badgeContract = getContract(badgeAddress, ABIs.DisasterDonorBadge, signer);
    const tx = await badgeContract.mint(to);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error minting disaster donor badge:', error);
    throw error;
  }
}

/**
 * Mint a GeneralDonorBadge (owner only)
 * @param {string} badgeAddress - Address of the GeneralDonorBadge contract
 * @param {string} to - Recipient address
 * @returns {Promise<string>} - Transaction hash
 */
async function mintGeneralDonorBadge(badgeAddress, to) {
  try {
    const { signer } = await getProviderAndSigner();
    const badgeContract = getContract(badgeAddress, ABIs.GeneralDonorBadge, signer);
    const tx = await badgeContract.mint(to);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error minting general donor badge:', error);
    throw error;
  }
}

/**
 * Set base URI for a badge contract (owner only)
 * @param {string} badgeAddress - Address of the badge contract
 * @param {string} newBaseURI - New base URI for token metadata
 * @returns {Promise<string>} - Transaction hash
 */
async function setBadgeBaseURI(badgeAddress, newBaseURI) {
  try {
    const { signer } = await getProviderAndSigner();
    const badgeContract = getContract(badgeAddress, ABIs.DisasterDonorBadge, signer); // Works for both badge types
    const tx = await badgeContract.setBaseURI(newBaseURI);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error setting badge base URI:', error);
    throw error;
  }
}

/**
 * Get total supply of a badge contract
 * @param {string} badgeAddress - Address of the badge contract
 * @returns {Promise<number>} - Total number of minted badges
 */
async function getBadgeTotalSupply(badgeAddress) {
  try {
    const { provider } = await getProviderAndSigner();
    const badgeContract = getContract(badgeAddress, ABIs.DisasterDonorBadge, provider); // Works for both
    return Number(await badgeContract.totalSupply());
  } catch (error) {
    console.error('Error fetching badge total supply:', error);
    throw error;
  }
}

export {
  approveUSDC,
  // DAOGovernance
  isAdmin,
  isDAOMember,
  addDAOMember,
  removeDAOMember,
  createProposal,
  vote,
  hasVoted,
  getProposal,
  getProposalCount,
  getMemberCount,
  setDisasterReliefFactory,
  setFundEscrow,
  // DisasterRelief
  donateToRelief,
  registerAsVictim,
  withdrawFunds,
  updateReliefState,
  getReliefState,
  getTotalFunds,
  getDonorCount,
  getVictimCount,
  // DisasterReliefFactory
  deployDisasterRelief,
  isDisasterRelief,
  setDAOGovernance,
  setZKVerifier,
  // FundEscrow
  donateToEscrow,
  allocateFunds,
  getEscrowBalance,
  // NFT Badges
  mintDisasterDonorBadge,
  mintGeneralDonorBadge,
  setBadgeBaseURI,
  getBadgeTotalSupply,
};