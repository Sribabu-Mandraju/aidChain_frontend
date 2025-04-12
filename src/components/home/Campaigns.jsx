"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import CampaignCard from "../shared/CampaignCard"
import flood from '../../assets/campaigns/floods.webp'

const campaignImages = [
  "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1610550603158-91f50474b235?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1595854341625-fc2528d3b11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500994340878-40ce894df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
]

const Campaigns = () => {
  const [filter, setFilter] = useState("All")

  const campaigns = [
    {
      title: "Hurricane Relief Fund",
      description:
        "Support communities devastated by Hurricane X in the Caribbean. Immediate assistance needed for food, shelter, and medical supplies.",
      totalDonations: "$125,000",
      goal: "$200,000",
      progress: 62.5,
      status: "Active",
      image: flood,
      daysLeft: 15,
      donors: 1234,
    },
    {
      title: "Earthquake Recovery Initiative",
      description:
        "Aid rebuilding efforts after a 7.2 magnitude earthquake in Southeast Asia. Help provide temporary housing and essential supplies.",
      totalDonations: "$89,500",
      goal: "$150,000",
      progress: 59.7,
      status: "Urgent",
      image: flood,
      daysLeft: 7,
      donors: 892,
    },
    {
      title: "Flood Relief Campaign",
      description:
        "Provide immediate relief to flood victims in Western Europe. Support evacuation efforts and emergency response teams.",
      totalDonations: "$47,200",
      goal: "$100,000",
      progress: 47.2,
      status: "Active",
      image: flood,
      daysLeft: 21,
      donors: 567,
    },
    {
      title: "Wildfire Support Network",
      description:
        "Help families displaced by wildfires in North America. Funding goes towards temporary housing and rebuilding efforts.",
      totalDonations: "$63,800",
      goal: "$80,000",
      progress: 79.75,
      status: "Completed",
      image: flood,
      daysLeft: 0,
      donors: 945,
    },
  ]

  const filterOptions = ["All", "Active", "Urgent", "Completed"]
  const filteredCampaigns = filter === "All" ? campaigns : campaigns.filter((campaign) => campaign.status === filter)

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
            <span className="text-green-800 font-medium text-sm">Live Campaigns</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Support Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Relief Campaigns
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Your donations help us provide critical aid to those in need. Join our global community of donors making a
            real difference.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCampaigns.map((campaign, index) => (
            <CampaignCard key={index} campaign={campaign} index={index} />
          ))}
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
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Campaigns