import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import fundEscrowABI from '../abis/fundEscrow.json';

const FUND_ESCROW_CONTRACT_ADDRESS = "0xE9FEfb23Ae5382390c54697EFD9E9d4AC3Cf1bdF"; // Replace with actual contract address

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
const getReadFundEscrowContract = () => ({
  publicClient,
  ...getFundEscrowContract(),
});

// Contract interaction functions
export const donate = async (amount, walletClient) => {
  try {
    if (!walletClient) {
      throw new Error("No wallet client provided");
    }
    const [address] = await walletClient.getAddresses();
    if (!address) {
      throw new Error("No account connected");
    }

    const { hash } = await walletClient.writeContract({
      address: FUND_ESCROW_CONTRACT_ADDRESS,
      abi: fundEscrowABI,
      functionName: 'donate',
      args: [amount],
      account: address,
    });
    return hash;
  } catch (error) {
    console.error('Error in donate:', error);
    throw error;
  }
};

export const getBalance = async () => {
  try {
    const contract = getReadFundEscrowContract();
    const balance = await contract.publicClient.readContract({
      ...contract,
      functionName: 'getBalance',
    });
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