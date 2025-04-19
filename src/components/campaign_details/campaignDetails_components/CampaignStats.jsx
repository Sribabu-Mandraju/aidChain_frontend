"use client"

import { motion } from "framer-motion"
import { DollarSign, Users, Target, Coins, Calendar, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getState, getDonationEndTime, getRegistrationEndTime, getWaitingEndTime, getDistributionEndTime } from "../../../providers/disasterRelief_provider"

const CampaignStats = ({ campaign, donors, victims }) => {
  const [currentState, setCurrentState] = useState(null)
  const [timeLeft, setTimeLeft] = useState({
    donation: 0,
    registration: 0,
    waiting: 0,
    distribution: 0,
  })

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time left
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Ended"
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
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
        return <DollarSign size={16} />
      case 1:
        return <Users size={16} />
      case 2:
        return <Loader2 size={16} className="animate-spin" />
      case 3:
        return <Coins size={16} />
      case 4:
        return <CheckCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
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

  // Update state and time
  const updateStateAndTime = async () => {
    try {
      const [state, donationEnd, registrationEnd, waitingEnd, distributionEnd] = await Promise.all([
        getState(campaign.contractAddress),
        getDonationEndTime(campaign.contractAddress),
        getRegistrationEndTime(campaign.contractAddress),
        getWaitingEndTime(campaign.contractAddress),
        getDistributionEndTime(campaign.contractAddress),
      ])

      const now = Math.floor(Date.now() / 1000)
      setCurrentState(state)

      setTimeLeft({
        donation: Number(donationEnd) - now,
        registration: Number(registrationEnd) - now,
        waiting: Number(waitingEnd) - now,
        distribution: Number(distributionEnd) - now,
      })
    } catch (error) {
      console.error("Error updating state:", error)
    }
  }

  useEffect(() => {
    updateStateAndTime()
    const interval = setInterval(updateStateAndTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [campaign.contractAddress])

  // Calculate percentage of target reached
  const calculateProgress = () => {
    if (!campaign.targetAmount || campaign.targetAmount === 0) return 100
    const raised = campaign.raisedAmount || 0
    return Math.min(100, Math.round((raised / campaign.targetAmount) * 100))
  }

  const progress = calculateProgress()

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Campaign Stats</h2>
          {/* State Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getStateColor()} shadow-md`}>
            {getStateIcon()}
            <span>{getStateMessage()}</span>
          </div>
        </div>

        {/* Time Left Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gray-800/80 backdrop-blur-sm shadow-md mb-4">
          <Clock size={14} />
          <span>{formatTimeLeft(getStateTimeLeft())}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">{campaign.raisedAmount || 0} USDC raised</span>
            <span className="text-sm font-medium text-gray-500">
              {campaign.targetAmount ? `${campaign.targetAmount} USDC target` : "No target set"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
            ></motion.div>
          </div>
          <div className="mt-1 text-right">
            <span className="text-sm font-medium text-gray-500">{progress}% of target</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Amount Per Victim */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Coins size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Amount Per Victim</div>
                <div className="text-lg font-bold text-gray-800">
                  {campaign.amountPerVictim || 0} <span className="text-sm font-normal text-gray-600">USDC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Donations */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Donations</div>
                <div className="text-lg font-bold text-gray-800">{campaign.totalDonations || 0}</div>
              </div>
            </div>
          </div>

          {/* Donors Count */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Unique Donors</div>
                <div className="text-lg font-bold text-gray-800">{donors || 0}</div>
              </div>
            </div>
          </div>

          {/* Victims Count */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Target size={20} className="text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Registered Victims</div>
                <div className="text-lg font-bold text-gray-800">{victims || 0}</div>
              </div>
            </div>
          </div>

          {/* Campaign Duration */}
          {/* <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar size={20} className="text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Campaign Duration</div>
                <div className="text-sm font-medium text-gray-800">
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </div>
              </div>
            </div>
          </div> */}

          {/* Campaign Phases */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 col-span-2">
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">Campaign Phases</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">
                  <div className="font-medium">Donation Period</div>
                  <div className="text-gray-600">{formatTimeLeft(timeLeft.donation)}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Registration Period</div>
                  <div className="text-gray-600">{formatTimeLeft(timeLeft.registration)}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Waiting Period</div>
                  <div className="text-gray-600">{formatTimeLeft(timeLeft.waiting)}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Distribution Period</div>
                  <div className="text-gray-600">{formatTimeLeft(timeLeft.distribution)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignStats
