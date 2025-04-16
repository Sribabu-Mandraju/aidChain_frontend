import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CampaignList from "../shared/campaignCard_components/CampaignList";
import { getAllDisasterReliefContracts } from "../../providers/disasterReliefFactory_provider";
import { getState, getTotalFunds, getDonorCount, getVictimCount, getLocationDetails, getDisasterName, getDonationEndTime, getAmountPerVictim } from "../../providers/disasterRelief_provider";

const Campaigns = () => {
  const [filter, setFilter] = useState("All");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Fetch all disaster relief contract addresses
        const contractAddresses = await getAllDisasterReliefContracts();
        console.log("Fetched contract addresses:", contractAddresses);

        // Fetch details for each contract
        const campaignPromises = contractAddresses.map(async (address) => {
          try {
            const [
              state,
              totalFunds,
              donorCount,
              victimCount,
              locationDetails,
              disasterName,
              donationEndTime,
              amountPerVictim
            ] = await Promise.all([
              getState(address),
              getTotalFunds(address),
              getDonorCount(address),
              getVictimCount(address),
              getLocationDetails(address),
              getDisasterName(address),
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
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            const secondsLeft = Number(donationEndTime) - currentTime;
            const daysLeft = secondsLeft > 0 ? Math.ceil(secondsLeft / (24 * 60 * 60)) : 0;

            // Construct campaign object using locationDetails as per the Location struct
            const campaign = {
              id: address,
              title: disasterName || `Disaster Relief #${address.slice(0, 6)}`,
              description: `Location: ${locationDetails.country || 'Unknown'}${locationDetails.state ? `, ${locationDetails.state}` : ''}${locationDetails.city ? `, ${locationDetails.city}` : ''}`,
              image: locationDetails.image || "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              status: statusMap[Number(state)] || "Unknown",
              totalDonations: `${(Number(totalFunds) / 1e6).toFixed(2)} USDC`, // USDC with 6 decimals
              goal: "N/A", // No goal in contract
              progress: 0, // No goal, so progress is not applicable
              donors: Number(donorCount),
              victimsCount: Number(victimCount), // Using victumes count 
              daysLeft: daysLeft,
              latitude: locationDetails.latitude || "0", // Direct access to latitude string
              longitude: locationDetails.longitude || "0", // Direct access to longitude string
              radius: locationDetails.radius || "10", // Direct access to radius string
              contractAddress: address,
              amountPerVictim: `${(Number(amountPerVictim) / 1e6).toFixed(2)} USDC`
            };

            return campaign;
          } catch (err) {
            console.error(`Error fetching details for contract ${address}:`, err);
            return null;
          }
        });

        const campaignsData = (await Promise.all(campaignPromises)).filter(Boolean);
        setCampaigns(campaignsData);

        // Log all campaign details
        console.log("All campaign details:", campaignsData);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filterOptions = ["All", "Active", "Registration", "Waiting", "Distribution", "Closed"];
  const filteredCampaigns =
    filter === "All"
      ? campaigns
      : campaigns.filter((campaign) => campaign.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-white to-green-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full mb-4">
            <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            <span className="text-green-800 font-medium text-sm">
              Live Campaigns
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Support Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Relief Campaigns
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Your donations help us provide critical aid to those in need. Join
            our global community of donors making a real difference.
          </p>
        </motion.div>

        {/* Filter Options */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-3 p-1 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  filter === option
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-white/80 text-gray-600 hover:bg-green-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="w-full max-w-7xl mx-auto">
          {filteredCampaigns.length > 0 ? (
            <CampaignList campaigns={filteredCampaigns} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No campaigns found matching the selected filter.</p>
            </div>
          )}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-8 py-3 bg-white text-green-600 border-2 border-green-200 rounded-full font-semibold hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-sm">
            View All Campaigns
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Campaigns;