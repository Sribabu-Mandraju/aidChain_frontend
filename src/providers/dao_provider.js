import { createPublicClient, http, createWalletClient, custom } from 'viem'
import { baseSepolia } from 'viem/chains'
import daoABI from '../abis/daoGovernance.json'

const DAO_CONTRACT_ADDRESS = "0x28C883CD0D075E2080d1fdC99d07D56f5fDf765b"

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http("https://base-sepolia.g.alchemy.com/v2/kBfhfjgaUbr1xz7I4QTPU7ZepOM6uMxK"),
})

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum),
})

export const getDaoContract = () => ({
  address: DAO_CONTRACT_ADDRESS,
  abi: daoABI,
})

export const getReadDaoContract = () => ({
  publicClient,
  ...getDaoContract(),
})

export const getWriteDaoContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("No wallet provider found")
    }
    const [address] = await walletClient.getAddresses()
    if (!address) {
      throw new Error("No account connected")
    }
    const chainId = await walletClient.getChainId()
    if (chainId !== baseSepolia.id) {
      throw new Error(`Please switch to Base Sepolia (chain ID: ${baseSepolia.id})`)
    }
    return {
      address: DAO_CONTRACT_ADDRESS,
      abi: daoABI,
      walletClient,
      publicClient,
    }
  } catch (error) {
    console.error("Error initializing write contract:", error)
    throw error
  }
}

export const setDisasterReliefFactory = async (factoryAddress) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'setDisasterReliefFactory',
      args: [factoryAddress],
      account,
    })
    console.log("Set factory transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in setDisasterReliefFactory:", error)
    throw new Error(`Failed to set factory: ${error.message}`)
  }
}

export const setFundEscrow = async (fundEscrowAddress) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'setFundEscrow',
      args: [fundEscrowAddress],
      account,
    })
    console.log("Set escrow transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in setFundEscrow:", error)
    throw new Error(`Failed to set escrow: ${error.message}`)
  }
}

export const addDAOMember = async (memberAddress) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'addDAOMember',
      args: [memberAddress],
      account,
    })
    console.log("Add member transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in addDAOMember:", error)
    throw new Error(`Failed to add member: ${error.message}`)
  }
}

export const removeDAOMember = async (memberAddress) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'removeDAOMember',
      args: [memberAddress],
      account,
    })
    console.log("Remove member transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in removeDAOMember:", error)
    throw new Error(`Failed to remove member: ${error.message}`)
  }
}

export const createProposal = async (disasterName, location, fundAmount, image) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    const locationStruct = {
      country: location.country || "",
      state: location.state || "",
      city: location.city || "",
      zipCode: location.zipCode || "",
      latitude: location.latitude || 0,
      longitude: location.longitude || 0,
      radius: location.radius || 0,
    }
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'createProposal',
      args: [disasterName, locationStruct, BigInt(fundAmount), image],
      account,
    })
    console.log("Create proposal transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in createProposal:", error)
    throw new Error(`Failed to create proposal: ${error.message}`)
  }
}

export const vote = async (proposalId, support) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    let gasEstimate
    try {
      gasEstimate = await contract.publicClient.estimateContractGas({
        address: contract.address,
        abi: contract.abi,
        functionName: 'vote',
        args: [BigInt(proposalId), support],
        account,
      })
    } catch (gasError) {
      console.warn("Gas estimation failed:", gasError)
      gasEstimate = BigInt(200000)
    }
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'vote',
      args: [BigInt(proposalId), support],
      account,
      gas: gasEstimate + BigInt(50000),
      maxFeePerGas: BigInt(1000000000),
      maxPriorityFeePerGas: BigInt(100000000),
    })
    console.log("Vote transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in vote:", error)
    throw new Error(`Failed to vote: ${error.message}`)
  }
}

export const executeProposal = async (proposalId) => {
  try {
    const contract = await getWriteDaoContract()
    const [account] = await contract.walletClient.getAddresses()
    let gasEstimate
    try {
      gasEstimate = await contract.publicClient.estimateContractGas({
        address: contract.address,
        abi: contract.abi,
        functionName: 'executeProposal',
        args: [BigInt(proposalId)],
        account,
      })
    } catch (gasError) {
      console.warn("Gas estimation failed:", gasError)
      gasEstimate = BigInt(5000000)
    }
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'executeProposal',
      args: [BigInt(proposalId)],
      account,
      gas: gasEstimate + BigInt(100000),
      maxFeePerGas: BigInt(1000000000),
      maxPriorityFeePerGas: BigInt(100000000),
    })
    console.log("Execute proposal transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in executeProposal:", error)
    throw new Error(`Failed to execute proposal: ${error.message}`)
  }
}

export const finalizeProposal = async (proposalId) => {
  try {
    const contract = await getWriteDaoContract()
    const proposal = await getProposal(proposalId)
    if (Number(proposal.state) !== 0) return
    const now = Math.floor(Date.now() / 1000)
    if (now <= Number(proposal.endTime)) return
    const requiredVotes = Math.ceil((60 * Number(await memberCount())) / 100)
    const state = Number(proposal.forVotes) >= requiredVotes ? 1 : 2
    const [account] = await contract.walletClient.getAddresses()
    let gasEstimate
    try {
      gasEstimate = await contract.publicClient.estimateContractGas({
        address: contract.address,
        abi: contract.abi,
        functionName: 'vote', // Simulate state change
        args: [BigInt(proposalId), true],
        account,
      })
    } catch (gasError) {
      console.warn("Gas estimation failed:", gasError)
      gasEstimate = BigInt(200000)
    }
    const hash = await contract.walletClient.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: 'vote', // Use vote to trigger state check
      args: [BigInt(proposalId), true],
      account,
      gas: gasEstimate + BigInt(50000),
    })
    console.log("Finalize proposal transaction:", hash)
    return hash
  } catch (error) {
    console.error("Error in finalizeProposal:", error)
    // Ignore if proposal is already finalized
    if (error.message.includes("not active")) return
    throw new Error(`Failed to finalize proposal: ${error.message}`)
  }
}

export const isDAOMember = async (address) => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'isDAOMember',
      args: [address],
    })
  } catch (error) {
    console.error("Error in isDAOMember:", error)
    throw new Error(`Failed to check member status: ${error.message}`)
  }
}

export const getProposal = async (proposalId) => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'getProposal',
      args: [BigInt(proposalId)],
    })
  } catch (error) {
    console.error("Error in getProposal:", error)
    throw new Error(`Failed to get proposal: ${error.message}`)
  }
}

export const hasVoted = async (proposalId, voter) => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'hasVoted',
      args: [BigInt(proposalId), voter],
    })
  } catch (error) {
    console.error("Error in hasVoted:", error)
    throw new Error(`Failed to check vote status: ${error.message}`)
  }
}

export const proposalCount = async () => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'proposalCount',
    })
  } catch (error) {
    console.error("Error in proposalCount:", error)
    throw new Error(`Failed to get proposal count: ${error.message}`)
  }
}

export const memberCount = async () => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'memberCount',
    })
  } catch (error) {
    console.error("Error in memberCount:", error)
    throw new Error(`Failed to get member count: ${error.message}`)
  }
}

export const getProposalStatus = async (proposalId) => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'getProposalStatus',
      args: [BigInt(proposalId)],
    })
  } catch (error) {
    console.error("Error in getProposalStatus:", error)
    throw new Error(`Failed to get proposal status: ${error.message}`)
  }
}

export const getDAOMembers = async () => {
  try {
    const contract = getReadDaoContract()
    return await contract.publicClient.readContract({
      ...contract,
      functionName: 'getDAOMembers',
    })
  } catch (error) {
    console.error("Error in getDAOMembers:", error)
    throw new Error(`Failed to get DAO members: ${error.message}`)
  }
}