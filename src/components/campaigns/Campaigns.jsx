import { useState } from "react";
import CampaignHeader from "./campaigns_components/CampaignHeader";
import CampaignFilters from "./campaigns_components/CampaignFilters";
import CampaignGrid from "./campaigns_components/CampaignGrid";
import DonationSection from "./campaigns_components/DonationSection";
import CampaignFooter from "./campaigns_components/CampaignFooter";
import CampaignList from "../shared/campaignCard_components/CampaignList";
import { updateMetaTags } from "../../utils/metaTags";
import Campaigns from "../home/Campaigns";


// Sample campaign data (replace with real data from a contract or API)
const campaigns = [
  {
    id: "1",
    title: "Clean Water Initiative",
    description:
      "Help us provide clean drinking water to communities affected by the recent drought. Your support will fund water purification systems and well construction in areas with limited access to clean water sources. Join us in making a difference!",
    image:
      "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80",
    status: "Urgent",
    totalDonations: "15.5 ETH",
    goal: "30 ETH",
    progress: 52,
    donors: 78,
    volunteers: 24,
    daysLeft: 12,
    latitude: "37.7749",
    longitude: "-122.4194",
    radius: "10",
  },
  {
    id: "2",
    title: "Reforestation Project",
    description:
      "Join our effort to restore forest ecosystems damaged by wildfires. We're planting native trees and implementing sustainable land management practices to prevent future disasters and support local wildlife.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80",
    status: "Active",
    totalDonations: "22.3 ETH",
    goal: "40 ETH",
    progress: 56,
    donors: 104,
    volunteers: 37,
    daysLeft: 25,
    latitude: "34.0522",
    longitude: "-118.2437",
    radius: "15",
  },
  {
    id: "3",
    title: "Hurricane Relief Fund",
    description:
      "Support families affected by Hurricane Maria with emergency supplies, temporary housing, and rebuilding assistance. Your donation provides immediate relief and long-term recovery support to devastated communities.",
    image:
      "https://images.unsplash.com/photo-1603720999656-f4f9d7e186f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630&q=80",
    status: "Urgent",
    totalDonations: "45.8 ETH",
    goal: "50 ETH",
    progress: 92,
    donors: 215,
    volunteers: 68,
    daysLeft: 5,
    latitude: "25.7617",
    longitude: "-80.1918",
    radius: "25",
  },
];

const CampaignsSection = () => {
  const [filter, setFilter] = useState("All");

  const filteredCampaigns =
    filter === "All"
      ? campaigns
      : campaigns.filter((campaign) => campaign.status === filter);

  const handleShare = (campaign) => {
    // Create the campaign URL
    const campaignUrl = `${window.location.origin}/campaigns/${campaign.id}`;
    
    // Update meta tags for social sharing
    updateMetaTags({
      ...campaign,
      url: campaignUrl
    });

    // Share on different platforms
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: campaignUrl,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `${campaign.title}\n${campaign.description}\n${campaignUrl}`;
      navigator.clipboard.writeText(text).then(() => {
        alert("Campaign link copied to clipboard!");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      {/* <CampaignFilters filter={filter} setFilter={setFilter} /> */}
      {/* <CampaignList 
        campaigns={filteredCampaigns} 
        onShare={handleShare}
      /> */}
      <Campaigns />
      <DonationSection campaigns={campaigns} />
      <CampaignFooter />
    </div>
  );
};

export default CampaignsSection;