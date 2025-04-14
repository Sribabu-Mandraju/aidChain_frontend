// Disaster Relief functions for interacting with Disaster Relief contracts
import { ethers } from "ethers"
import { getContracts, getReliefContract } from "../provider"

/**
 * Donate to a specific disaster relief campaign
 * @param {string} reliefAddress - Address of the disaster relief contract
 * @param {string} amount - Amount to donate in USDC
 */
export async function donateToRelief(reliefAddress, amount) {
  try {
    const { usdc } = getContracts()
    const reliefContract = getReliefContract(reliefAddress)

    // First approve USDC spending
    const approveTx = await usdc.approve(reliefAddress, ethers.utils.parseUnits(amount, 6))
    await approveTx.wait()

    // Then donate
    const tx = await reliefContract.donate(ethers.utils.parseUnits(amount, 6))
    await tx.wait()
  } catch (error) {
    console.error("Error donating to relief:", error)
    throw error
  }
}

/**
 * Register as a victim for a disaster relief campaign
 * @param {string} reliefAddress - Address of the disaster relief contract
 * @param {string} zkProof - Zero-knowledge proof
 */
export async function registerAsVictim(reliefAddress, zkProof) {
  try {
    const reliefContract = getReliefContract(reliefAddress)

    const tx = await reliefContract.registerAsVictim(zkProof)
    await tx.wait()
  } catch (error) {
    console.error("Error registering as victim:", error)
    throw error
  }
}

/**
 * Withdraw funds as a victim
 * @param {string} reliefAddress - Address of the disaster relief contract
 */
export async function withdrawReliefFunds(reliefAddress) {
  try {
    const reliefContract = getReliefContract(reliefAddress)

    const tx = await reliefContract.withdrawFunds()
    await tx.wait()
  } catch (error) {
    console.error("Error withdrawing relief funds:", error)
    throw error
  }
}

/**
 * Get disaster relief campaign details
 * @param {string} reliefAddress - Address of the disaster relief contract
 * @returns {Promise<Object>} Campaign details
 */
export async function getReliefCampaignDetails(reliefAddress) {
  try {
    const reliefContract = getReliefContract(reliefAddress)

    const [state, totalFunds, donorCount, victimCount, location] = await Promise.all([
      reliefContract.getState(),
      reliefContract.getTotalFunds(),
      reliefContract.getDonorCount(),
      reliefContract.getVictimCount(),
      reliefContract.getLocationDetails(),
    ])

    return {
      state,
      totalFunds: ethers.utils.formatUnits(totalFunds, 6),
      donorCount: donorCount.toString(),
      victimCount: victimCount.toString(),
      location,
    }
  } catch (error) {
    console.error("Error getting relief campaign details:", error)
    throw error
  }
}
