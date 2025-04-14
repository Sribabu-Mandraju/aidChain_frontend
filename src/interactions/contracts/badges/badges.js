// NFT Badge functions for interacting with Badge contracts
import { getContracts } from "../provider"

/**
 * Get general donor badge balance
 * @param {string} address - User's address
 * @returns {Promise<string>} Number of badges owned
 */
export async function getGeneralDonorBadgeBalance(address) {
  try {
    const { generalDonorBadge } = getContracts()

    const balance = await generalDonorBadge.balanceOf(address)
    return balance.toString()
  } catch (error) {
    console.error("Error getting general donor badge balance:", error)
    throw error
  }
}

/**
 * Get disaster donor badge balance
 * @param {string} address - User's address
 * @returns {Promise<string>} Number of badges owned
 */
export async function getDisasterDonorBadgeBalance(address) {
  try {
    const { disasterDonorBadge } = getContracts()

    const balance = await disasterDonorBadge.balanceOf(address)
    return balance.toString()
  } catch (error) {
    console.error("Error getting disaster donor badge balance:", error)
    throw error
  }
}

/**
 * Get all badges owned by an address
 * @param {string} address - User's address
 * @returns {Promise<Object>} Object containing both badge balances
 */
export async function getAllBadges(address) {
  try {
    const [generalBadges, disasterBadges] = await Promise.all([
      getGeneralDonorBadgeBalance(address),
      getDisasterDonorBadgeBalance(address),
    ])

    return {
      generalDonorBadges: generalBadges,
      disasterDonorBadges: disasterBadges,
    }
  } catch (error) {
    console.error("Error getting all badges:", error)
    throw error
  }
}
