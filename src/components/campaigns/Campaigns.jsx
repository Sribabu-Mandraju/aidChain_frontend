"use client";

import { useState } from "react";
import CampaignHeader from "./campaigns_components/CampaignHeader";
import CampaignFilters from "./campaigns_components/CampaignFilters";
import CampaignGrid from "./campaigns_components/CampaignGrid";
import DonationSection from "./campaigns_components/DonationSection";
import CampaignFooter from "./campaigns_components/CampaignFooter";

// Sample campaign data (replace with real data from a contract or API)
const campaigns = [
  {
    id: 1,
    title: "Hurricane Relief Fund",
    description:
      "Support communities devastated by Hurricane X in the Caribbean. Immediate assistance needed for food, shelter, and medical supplies.",
    totalDonations: 125000,
    goal: 200000,
    progress: 62.5,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    daysLeft: 15,
    donors: 1234,
    location: "Caribbean",
    category: "Hurricane Relief",
  },
  {
    id: 2,
    title: "Earthquake Recovery Initiative",
    description:
      "Aid rebuilding efforts after a 7.2 magnitude earthquake in Southeast Asia. Help provide temporary housing and essential supplies.",
    totalDonations: 89500,
    goal: 150000,
    progress: 59.7,
    status: "Urgent",
    image:
      "https://images.unsplash.com/photo-1610550603158-91f50474b235?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    daysLeft: 7,
    donors: 892,
    location: "Southeast Asia",
    category: "Earthquake Recovery",
  },
  {
    id: 3,
    title: "Flood Relief Campaign",
    description:
      "Provide immediate relief to flood victims in Western Europe. Support evacuation efforts and emergency response teams.",
    totalDonations: 47200,
    goal: 100000,
    progress: 47.2,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1595854341625-fc2528d3b11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    daysLeft: 21,
    donors: 567,
    location: "Western Europe",
    category: "Flood Relief",
  },
  {
    id: 4,
    title: "Wildfire Support Network",
    description:
      "Help families displaced by wildfires in North America. Funding goes towards temporary housing and rebuilding efforts.",
    totalDonations: 63800,
    goal: 80000,
    progress: 79.75,
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1500994340878-40ce894df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    daysLeft: 0,
    donors: 945,
    location: "North America",
    category: "Wildfire Support",
  },
];

const CampaignsSection = () => {
  const [filter, setFilter] = useState("All");

  const filteredCampaigns =
    filter === "All"
      ? campaigns
      : campaigns.filter((campaign) => campaign.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <CampaignHeader />
      <CampaignFilters filter={filter} setFilter={setFilter} />
      <CampaignGrid campaigns={filteredCampaigns} />
      <DonationSection campaigns={campaigns} />
      <CampaignFooter />
    </div>
  );
};

export default CampaignsSection;
