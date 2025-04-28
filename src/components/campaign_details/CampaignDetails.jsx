"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import CampaignHeader from "../campaigns/campaigns_components/CampaignHeader"
import CampaignStats from "../campaign_details/campaignDetails_components/CampaignStats"
import CampaignDescription from "../campaign_details/campaignDetails_components/CampaignDescription"
import CampaignLocation from "../campaign_details/campaignDetails_components/CampaignLocation"
import CampaignTimeline from "../campaign_details/campaignDetails_components/CampaignTimeline"
import CampaignActions from "../campaign_details/campaignDetails_components/CampaignActions"
import CampaignDonors from "../campaign_details/campaignDetails_components/CampaignDonors"
import CampaignUpdates from "./campaignDetails_components/CampaignUpdates"
import CampaignDocuments from "../campaign_details/campaignDetails_components/CampaignDocuments"
import { toast } from "react-hot-toast"
import LoadingState from "./common/LoadingState"
import ErrorState from "./common/ErrorState"
import {
  getState,
  getDonationEndTime,
  getRegistrationEndTime,
  getWaitingEndTime,
  getDistributionEndTime,
} from "../../providers/disasterRelief_provider"

const CampaignDetails = () => {
  const { proposalId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentState, setCurrentState] = useState(null)
  const [timeLeft, setTimeLeft] = useState({
    donation: 0,
    registration: 0,
    waiting: 0,
    distribution: 0,
  })
  const [donors, setDonors] = useState([])
  const [victims, setVictims] = useState([])
  const [updates, setUpdates] = useState([])
  const [activeTab, setActiveTab] = useState("details")

  // Get campaign from Redux store
  const campaigns = useSelector((state) => state.campaigns.campaigns)
  console.log(campaigns)
  const campaign = campaigns.find(c => c.id === proposalId)


  // Fetch campaign state and timelines
  useEffect(() => {
    const fetchCampaignState = async () => {
      if (!campaign) {
        setError("Campaign not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch campaign state and timelines
        const [
          state,
          donationEnd,
          registrationEnd,
          waitingEnd,
          distributionEnd,
        ] = await Promise.all([
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

        // Initialize empty arrays for donors, victims, and updates
        setDonors([])
        setVictims([])
        setUpdates([])
        setError(null)
      } catch (err) {
        console.error("Error fetching campaign state:", err)
        setError("Failed to load campaign state. Please try again later.")
        toast.error("Failed to load campaign state")
      } finally {
        setLoading(false)
      }
    }

    if (campaign) {
      fetchCampaignState()
    }

    // Set up interval to update time left
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const now = Math.floor(Date.now() / 1000)
        return {
          donation: prev.donation > 0 ? prev.donation - 1 : 0,
          registration: prev.registration > 0 ? prev.registration - 1 : 0,
          waiting: prev.waiting > 0 ? prev.waiting - 1 : 0,
          distribution: prev.distribution > 0 ? prev.distribution - 1 : 0,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [campaign])

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  if (loading) {
    return <LoadingState message="Loading campaign details..." />
  }

  if (error || !campaign) {
    return <ErrorState message={error || "Campaign not found"} />
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Campaign Header */}
      <CampaignHeader 
        campaign={campaign} 
        currentState={currentState} 
        timeLeft={timeLeft} 
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => handleTabChange("details")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "details"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleTabChange("updates")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "updates"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Updates
                  </button>
                  <button
                    onClick={() => handleTabChange("donors")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "donors"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Donors
                  </button>
                  <button
                    onClick={() => handleTabChange("documents")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "documents"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Documents
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "details" && <CampaignDescription campaign={campaign} />}
                {activeTab === "updates" && <CampaignUpdates updates={updates} />}
                {activeTab === "donors" && <CampaignDonors donors={donors} />}
                {activeTab === "documents" && <CampaignDocuments campaign={campaign} />}
              </div>
            </div>

            {/* Campaign Location Map */}
            {activeTab === "details" && (
              <CampaignLocation
                latitude={campaign.latitude}
                longitude={campaign.longitude}
                radius={campaign.radius}
                title={campaign.title}
              />
            )}

            {/* Campaign Timeline */}
            {activeTab === "details" && (
              <CampaignTimeline 
                campaign={campaign} 
                currentState={currentState} 
                timeLeft={timeLeft} 
              />
            )}
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="space-y-8">
            {/* Campaign Stats */}
            <CampaignStats 
              campaign={campaign} 
              donors={donors.length} 
              victims={victims.length} 
            />

            {/* Campaign Actions */}
            <CampaignActions
              campaign={campaign}
              currentState={currentState}
              contractAddress={campaign.contractAddress}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
