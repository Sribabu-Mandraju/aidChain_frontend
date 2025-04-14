// DAO Governance functions for interacting with the DAO Governance contract
import { ethers } from "ethers"
import { getContracts } from "../provider"

/**
 * Create a new disaster relief proposal
 * @param {string} disasterName - Name of the disaster
 * @param {Object} location - Location details {latitude, longitude, radius}
 * @param {string} fundAmount - Amount of funds requested
 * @param {string} image - URL of the disaster image
 * @returns {Promise<string>} Proposal ID
 */
export async function createProposal(disasterName, location, fundAmount, image) {
  try {
    const { daoGovernance } = getContracts()

    const tx = await daoGovernance.createProposal(
      disasterName,
      location,
      ethers.utils.parseUnits(fundAmount, 6), // Assuming USDC has 6 decimals
      image,
    )
    const receipt = await tx.wait()
    return receipt.events[0].args.proposalId.toString()
  } catch (error) {
    console.error("Error creating proposal:", error)
    throw error
  }
}

/**
 * Vote on a proposal
 * @param {string} proposalId - ID of the proposal
 * @param {boolean} support - Whether to support the proposal
 */
export async function voteOnProposal(proposalId, support) {
  try {
    const { daoGovernance } = getContracts()

    const tx = await daoGovernance.vote(proposalId, support)
    await tx.wait()
  } catch (error) {
    console.error("Error voting on proposal:", error)
    throw error
  }
}

/**
 * Get proposal details
 * @param {string} proposalId - ID of the proposal
 * @returns {Promise<Object>} Proposal details
 */
export async function getProposal(proposalId) {
  try {
    const { daoGovernance } = getContracts()

    const proposal = await daoGovernance.getProposal(proposalId)
    return {
      id: proposal.id.toString(),
      proposer: proposal.proposer,
      disasterName: proposal.disasterName,
      location: proposal.location,
      fundsRequested: ethers.utils.formatUnits(proposal.fundsRequested, 6),
      startTime: new Date(proposal.startTime * 1000),
      endTime: new Date(proposal.endTime * 1000),
      forVotes: proposal.forVotes.toString(),
      againstVotes: proposal.againstVotes.toString(),
      image: proposal.image,
      state: proposal.state,
    }
  } catch (error) {
    console.error("Error getting proposal:", error)
    throw error
  }
}

/**
 * Check if an address is a DAO member
 * @param {string} address - Address to check
 * @returns {Promise<boolean>} Whether the address is a DAO member
 */
export async function isDAOMember(address) {
  try {
    const { daoGovernance } = getContracts()
    return await daoGovernance.isDAOMember(address)
  } catch (error) {
    console.error("Error checking DAO membership:", error)
    throw error
  }
}

/**
 * Check if an address is a DAO admin
 * @param {string} address - Address to check
 * @returns {Promise<boolean>} Whether the address is a DAO admin
 */
export async function isDAOAdmin(address) {
  try {
    const { daoGovernance } = getContracts()
    return await daoGovernance.isAdmin(address)
  } catch (error) {
    console.error("Error checking DAO admin status:", error)
    throw error
  }
}

/**
 * Get total number of proposals
 * @returns {Promise<string>} Total number of proposals
 */
export async function getTotalProposals() {
  try {
    const { daoGovernance } = getContracts()
    const count = await daoGovernance.proposalCount()
    return count.toString()
  } catch (error) {
    console.error("Error getting total proposals:", error)
    throw error
  }
}

/**
 * Get total number of DAO members
 * @returns {Promise<string>} Total number of DAO members
 */
export async function getTotalDAOMembers() {
  try {
    const { daoGovernance } = getContracts()
    const count = await daoGovernance.memberCount()
    return count.toString()
  } catch (error) {
    console.error("Error getting total DAO members:", error)
    throw error
  }
}
