// Main entry point for contract interactions
import { initializeProvider } from "./provider"
import * as governance from "./dao/governance"
import * as escrow from "./funds/escrow"
import * as relief from "./funds/relief"
import * as badges from "./badges/badges"

// Export all contract interactions
export { initializeProvider, governance, escrow, relief, badges }
