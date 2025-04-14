// Fund Escrow functions for interacting with the Fund Escrow contract
import { ethers } from "ethers"
import { getContracts, CONTRACT_ADDRESSES } from "../provider"

/**
 * Donate to the general fund escrow
 * @param {string} amount - Amount to donate in USDC
 */
export async function donateToEscrow(amount) {
  try {
    const { fundEscrow, usdc } = getContracts()

    // First approve USDC spending
    const approveTx = await usdc.approve(CONTRACT_ADDRESSES.fundEscrow, ethers.utils.parseUnits(amount, 6))
    await approveTx.wait()

    // Then donate
    const tx = await fundEscrow.donate(ethers.utils.parseUnits(amount, 6))
    await tx.wait()
  } catch (error) {
    console.error("Error donating to escrow:", error)
    throw error
  }
}

/**
 * Get escrow balance
 * @returns {Promise<string>} Balance in USDC
 */
export async function getEscrowBalance() {
  try {
    const { fundEscrow } = getContracts()

    const balance = await fundEscrow.getBalance()
    return ethers.utils.formatUnits(balance, 6)
  } catch (error) {
    console.error("Error getting escrow balance:", error)
    throw error
  }
}
