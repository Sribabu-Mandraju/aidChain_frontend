import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllDisasterReliefContracts } from '../../providers/disasterReliefFactory_provider';
import { 
  getCampaignDetails, 
  getDonationEndTime, 
  getAmountPerVictim 
} from '../../providers/disasterRelief_provider';

// Async thunk to fetch all campaigns
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch all disaster relief contract addresses
      const contractAddresses = await getAllDisasterReliefContracts();
      console.log("Fetched contract addresses:", contractAddresses);

      // Fetch details for each contract
      const campaignPromises = contractAddresses.map(async (address) => {
        try {
          // Get all campaign details in parallel
          const [
            campaignDetails,
            donationEndTime,
            amountPerVictim
          ] = await Promise.all([
            getCampaignDetails(address),
            getDonationEndTime(address),
            getAmountPerVictim(address)
          ]);

          // Map state to status
          const statusMap = {
            0: "Active",
            1: "Registration",
            2: "Waiting",
            3: "Distribution",
            4: "Closed"
          };

          // Calculate days left based on donation end time
          const currentTime = Math.floor(Date.now() / 1000);
          const secondsLeft = Number(donationEndTime) - currentTime;
          const daysLeft = secondsLeft > 0 ? Math.ceil(secondsLeft / (24 * 60 * 60)) : 0;

          // Format location string
          const locationString = [
            campaignDetails.location.country,
            campaignDetails.location.state,
            campaignDetails.location.city
          ]
            .filter(Boolean)
            .join(", ");

          // Construct campaign object
          return {
            id: address,
            title: campaignDetails.disasterName,
            description: `Location: ${locationString || 'Unknown'}`,
            image: campaignDetails.image || campaignDetails.location.image || "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: statusMap[campaignDetails.state] || "Unknown",
            totalDonations: `${(Number(campaignDetails.totalFunds) / 1e6).toFixed(2)} USDC`,
            goal: "N/A",
            progress: 0,
            donors: campaignDetails.totalDonors,
            victimsCount: campaignDetails.totalVictimsRegistered,
            daysLeft: daysLeft,
            latitude: campaignDetails.location.latitude || "0",
            longitude: campaignDetails.location.longitude || "0",
            radius: campaignDetails.location.radius || "10",
            contractAddress: address,
            amountPerVictim: `${(Number(amountPerVictim) / 1e6).toFixed(2)} USDC`,
            disasterId: campaignDetails.disasterId
          };
        } catch (err) {
          console.error(`Error fetching details for contract ${address}:`, err);
          return null;
        }
      });

      const campaignsData = (await Promise.all(campaignPromises)).filter(Boolean);
      return campaignsData;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  campaigns: [],
  loading: false,
  error: null,
  filter: "All",
  lastFetchTime: null,
  hasData: false
};

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
      state.lastFetchTime = null;
      state.hasData = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        state.lastFetchTime = Date.now();
        state.hasData = action.payload.length > 0;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasData = false;
      });
  }
});

export const { setFilter, clearCampaigns } = campaignSlice.actions;

// Selectors
export const selectAllCampaigns = (state) => state.campaigns.campaigns;
export const selectFilteredCampaigns = (state) => {
  const { campaigns, filter } = state.campaigns;
  return filter === "All" ? campaigns : campaigns.filter(campaign => campaign.status === filter);
};
export const selectCampaignsLoading = (state) => state.campaigns.loading;
export const selectCampaignsError = (state) => state.campaigns.error;
export const selectCurrentFilter = (state) => state.campaigns.filter;
export const selectLastFetchTime = (state) => state.campaigns.lastFetchTime;
export const selectHasCampaigns = (state) => state.campaigns.hasData;

export default campaignSlice.reducer;
