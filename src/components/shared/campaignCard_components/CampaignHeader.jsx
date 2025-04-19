import { motion } from "framer-motion"
import { Users, Heart, Share2, MapPin, Info } from "lucide-react"

const CampaignHeader = ({ 
  campaign, 
  onShare, 
  onMap, 
  onDetails,
  progress,
  getStateColor,
  getStateIcon,
  getStateMessage
}) => {
  return (
    <div className="flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
        <div className={`h-full ${getStateColor()}`} style={{ width: `${progress}%` }}></div>
      </div>

      {/* Card Image */}
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={campaign.image || "/placeholder.svg?height=400&width=600"}
          alt={campaign.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">{campaign.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
              <Users size={12} />
              <span>{campaign.victimsCount} victims</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
              <Heart size={12} />
              <span>{campaign.totalDonations} donations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="p-4 flex flex-wrap gap-2">
        {/* State Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getStateColor()} shadow-md`}>
          {getStateIcon()}
          <span>{getStateMessage()}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-auto">
          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            title="Share Campaign"
          >
            <Share2 size={18} />
          </motion.button>

          {/* Map Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMap}
            className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            title="View on map"
          >
            <MapPin size={18} />
          </motion.button>

          {/* Details Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDetails}
            className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            title="Campaign details"
          >
            <Info size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default CampaignHeader 