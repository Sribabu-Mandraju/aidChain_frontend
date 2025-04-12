"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import flood from '../../assets/campaigns/floods.webp'

const campaignImages = [
  "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1610550603158-91f50474b235?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1595854341625-fc2528d3b11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500994340878-40ce894df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
]

const Campaigns = () => {
  const [filter, setFilter] = useState("All")
  const [hoveredCard, setHoveredCard] = useState(null)

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                </div>
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.status === "Urgent"
                      ? "bg-red-500 text-white"
                      : campaign.status === "Active"
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-green-600">{campaign.totalDonations}</span>
                    <span className="text-gray-500">of {campaign.goal}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transform origin-left transition-transform duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-green-600 font-semibold">{campaign.donors}</div>
                    <div className="text-xs text-gray-500">Donors</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-green-600 font-semibold">
                      {campaign.daysLeft > 0 ? `${campaign.daysLeft} Days` : "Completed"}
                    </div>
                    <div className="text-xs text-gray-500">{campaign.daysLeft > 0 ? "Left" : ""}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors duration-300">
                    Learn More
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-400 hover:to-emerald-500 transition-colors duration-300">
                    Donate Now
                  </button>
                </div>
              </div>
            </motion.div>
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