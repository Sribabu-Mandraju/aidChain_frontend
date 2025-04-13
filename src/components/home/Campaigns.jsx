import { useState } from "react";
import { motion } from "framer-motion";
import CampaignCard from "../shared/CampaignCard";
import flood from "../../assets/campaigns/floods.webp";
import CampaignList from "../shared/campaignCard_components/CampaignList";

const campaignImages = [
  "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1610550603158-91f50474b235?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1595854341625-fc2528d3b11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500994340878-40ce894df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
];

const Campaigns = () => {
  const [filter, setFilter] = useState("All");

  const campaigns = [
    {
      id: "1",
      title: "Clean Water Initiative",
      description:
        "Help us provide clean drinking water to communities affected by the recent drought. Your support will fund water purification systems and well construction in areas with limited access to clean water sources. Join us in making a difference!",
      image:
        "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
        "https://images.unsplash.com/photo-1603720999656-f4f9d7e186f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

  const filterOptions = ["All", "Active", "Urgent", "Completed"];
  const filteredCampaigns =
    filter === "All"
      ? campaigns
      : campaigns.filter((campaign) => campaign.status === filter);

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
          {/* {filteredCampaigns.map((campaign, index) => ( */}
          <CampaignList campaigns={filteredCampaigns} />
          {/* ))} */}
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
