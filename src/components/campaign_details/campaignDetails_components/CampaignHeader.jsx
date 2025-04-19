"use client"

import { motion } from "framer-motion"
import { Share2, Clock, AlertCircle, CheckCircle, Loader2, DollarSign, UserPlus, Coins } from "lucide-react"
import { useState } from "react"
import ShareModal from "../modals/ShareModal"

const CampaignHeader = ({ campaign, currentState, timeLeft }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Format time left
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Ended"

    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const secs = Math.floor(seconds % 60)

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  // Get state-specific time left
  const getStateTimeLeft = () => {
    switch (currentState) {
      case 0:
        return timeLeft.donation
      case 1:
        return timeLeft.registration
      case 2:
        return timeLeft.waiting
      case 3:
        return timeLeft.distribution
      default:
        return 0
    }
  }

  // Get state-specific message
  const getStateMessage = () => {
    switch (currentState) {
      case 0:
        return "Donation Period"
      case 1:
        return "Registration Period"
      case 2:
        return "Waiting Period"
      case 3:
        return "Distribution Period"
      case 4:
        return "Campaign Ended"
      default:
        return "Loading..."
    }
  }

  // Get state-specific color
  const getStateColor = () => {
    switch (currentState) {
      case 0:
        return "bg-gradient-to-r from-emerald-500 to-green-600"
      case 1:
        return "bg-gradient-to-r from-blue-500 to-indigo-600"
      case 2:
        return "bg-gradient-to-r from-amber-500 to-yellow-600"
      case 3:
        return "bg-gradient-to-r from-purple-500 to-violet-600"
      case 4:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  // Get state-specific icon
  const getStateIcon = () => {
    switch (currentState) {
      case 0:
        return <DollarSign size={18} />
      case 1:
        return <UserPlus size={18} />
      case 2:
        return <Loader2 size={18} className="animate-spin" />
      case 3:
        return <Coins size={18} />
      case 4:
        return <CheckCircle size={18} />
      default:
        return <AlertCircle size={18} />
    }
  }

  // Share URL
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/campaigns/${campaign.id}` : ""
  const shareTitle = `Support ${campaign.title} - Help make a difference!`

  return (
    <div className="relative">
      {/* Hero Image with Overlay */}
      <div className="h-[400px] w-full relative overflow-hidden">
        <img
          src={campaign.image || "/placeholder.svg?height=800&width=1200"}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      {/* Campaign Title and Status */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white ${getStateColor()} shadow-md`}
                >
                  {getStateIcon()}
                  <span>{getStateMessage()}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-800/80 backdrop-blur-sm shadow-md">
                  <Clock size={16} />
                  <span>{formatTimeLeft(getStateTimeLeft())}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md mb-2">{campaign.title}</h1>

              <p className="text-white/80 text-lg max-w-3xl">
                {campaign.shortDescription || campaign.description.substring(0, 120) + "..."}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300"
            >
              <Share2 size={20} />
              <span>Share Campaign</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          campaign={campaign}
        />
      )}
    </div>
  )
}

export default CampaignHeader
