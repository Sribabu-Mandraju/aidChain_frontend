import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReadDaoContract, getWriteDaoContract } from '../../providers/dao_provider';
import { useAccount } from 'wagmi';

// Async thunk to fetch DAO members
export const fetchDAOMembers = createAsyncThunk(
  'daoMembers/fetchDAOMembers',
  async (_, { rejectWithValue }) => {
    try {
      const contract = getReadDaoContract();
      if (!contract || !contract.publicClient) {
        throw new Error("DAO contract or public client not available");
      }

      const memberAddressesResult = await contract.publicClient.readContract({
        ...contract,
        functionName: 'getDAOMembers',
      });

      if (!Array.isArray(memberAddressesResult)) {
        if (memberAddressesResult == null) {
          return [];
        }
        throw new Error(`Invalid data type received from getDAOMembers: expected array, got ${typeof memberAddressesResult}`);
      }

      return memberAddressesResult.map(address => ({
        address: address,
        joinedAt: new Date().toISOString() // Placeholder join date
      }));
    } catch (error) {
      console.error("Error fetching DAO members:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a new DAO member
export const addDAOMember = createAsyncThunk(
  'daoMembers/addDAOMember',
  async ({ address, connectedAddress }, { rejectWithValue }) => {
    try {
      const contract = getWriteDaoContract();
      if (!contract || !contract.publicClient || !contract.walletClient) {
        throw new Error("DAO contract, public client, or wallet client not available");
      }

      const isAdmin = await contract.publicClient.readContract({
        ...contract,
        functionName: 'isAdmin',
        args: [connectedAddress],
      });

      if (!isAdmin) {
        throw new Error("Only admins can add members");
      }

      const hash = await contract.walletClient.writeContract({
        ...contract,
        functionName: 'addDAOMember',
        args: [address],
        account: connectedAddress,
      });

      const receipt = await contract.publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status !== 'success') {
        throw new Error(`Transaction failed. Status: ${receipt.status}`);
      }

      return { address, hash };
    } catch (error) {
      console.error("Error adding DAO member:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove a DAO member
export const removeDAOMember = createAsyncThunk(
  'daoMembers/removeDAOMember',
  async ({ address, connectedAddress }, { rejectWithValue }) => {
    try {
      const contract = getWriteDaoContract();
      if (!contract || !contract.publicClient || !contract.walletClient) {
        throw new Error("DAO contract, public client, or wallet client not available");
      }

      const isAdmin = await contract.publicClient.readContract({
        ...contract,
        functionName: 'isAdmin',
        args: [connectedAddress],
      });

      if (!isAdmin) {
        throw new Error("Only admins can remove members");
      }

      const hash = await contract.walletClient.writeContract({
        ...contract,
        functionName: 'removeDAOMember',
        args: [address],
        account: connectedAddress,
      });

      const receipt = await contract.publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status !== 'success') {
        throw new Error(`Transaction failed. Status: ${receipt.status}`);
      }

      return { address, hash };
    } catch (error) {
      console.error("Error removing DAO member:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  members: [],
  loading: false,
  error: null,
  searchTerm: '',
  hasData: false
};

const daoMembersSlice = createSlice({
  name: 'daoMembers',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearMembers: (state) => {
      state.members = [];
      state.loading = false;
      state.error = null;
      state.hasData = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDAOMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDAOMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
        state.hasData = action.payload.length > 0;
      })
      .addCase(fetchDAOMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasData = false;
      })
      .addCase(addDAOMember.fulfilled, (state, action) => {
        state.members.push({
          address: action.payload.address,
          joinedAt: new Date().toISOString()
        });
        state.hasData = true;
      })
      .addCase(removeDAOMember.fulfilled, (state, action) => {
        state.members = state.members.filter(member => member.address !== action.payload.address);
        state.hasData = state.members.length > 0;
      });
  }
});

export const { setSearchTerm, clearMembers } = daoMembersSlice.actions;

// Selectors
export const selectMembers = (state) => state.daoMembers.members;
export const selectMembersLoading = (state) => state.daoMembers.loading;
export const selectMembersError = (state) => state.daoMembers.error;
export const selectSearchTerm = (state) => state.daoMembers.searchTerm;
export const selectHasMembers = (state) => state.daoMembers.hasData;

export const selectFilteredMembers = (state) => {
  const { members, searchTerm } = state.daoMembers;
  if (!searchTerm) return members;
  
  const searchLower = searchTerm.toLowerCase();
  return members.filter(member => 
    member.address.toLowerCase().includes(searchLower)
  );
};

export default daoMembersSlice.reducer;