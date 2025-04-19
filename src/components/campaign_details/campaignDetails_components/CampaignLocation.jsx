"use client"

import { useState } from "react"
import { MapPin, Maximize2, Minimize2 } from "lucide-react"
import CampaignMap from "../common/CampaignMap"

const CampaignLocation = ({ latitude, longitude, radius, title }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={20} className="text-red-500" />
            Campaign Location
          </h2>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            {expanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        <div
          className={`rounded-xl overflow-hidden border border-gray-200 ${expanded ? "h-[500px]" : "h-[300px]"} transition-all duration-300`}
        >
          <CampaignMap latitude={latitude} longitude={longitude} radius={radius} title={title} />
        </div>

        <div className="mt-4 flex items-center gap-2 text-gray-600">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm">Affected area radius: {radius} km</span>
        </div>
      </div>
    </div>
  )
}

export default CampaignLocation
