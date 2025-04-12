"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const CampaignCard = ({ campaign, index }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
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
  )
}

export default CampaignCard