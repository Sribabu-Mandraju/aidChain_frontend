"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Loader,
} from "lucide-react"
import { formatAddress, formatCurrency, formatDate } from "../../utils/dao_helper"


import ProposalVoteModal from "./proposal_components/ProposalVoteModal"
import ProposalStatusBadge from "./proposal_components/ProposalStatusBadge"
import ProposalVotersList from "./proposal_components/ProposalVotersList"

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

const ProposalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isUserDaoMember, setIsUserDaoMember] = useState(true) // Mock - would be determined by wallet connection
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [showAllVoters, setShowAllVoters] = useState(false)

  // Fetch proposal data
  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call to your backend or blockchain
        // Mock data for demonstration
        const mockProposal = {
          id: Number.parseInt(id),
          proposer: "0x1234567890123456789012345678901234567890",
          disasterName: "Hurricane Relief Fund",
          description:
            "This proposal aims to provide immediate relief to communities affected by the recent hurricane. Funds will be used for emergency shelter, food, clean water, and medical supplies. We'll work with local organizations to ensure efficient distribution.",
          area: "Caribbean Islands",
          location: {
            latitude: 18.2208,
            longitude: -66.5901,
            radius: 200, // km
          },
          duration: 15, // days
          fundsRequested: 200000,
          startTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
          endTime: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
          registrationPeriod: {
            start: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
            end: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
          },
          claimingPeriod: {
            start: Date.now() + 31 * 24 * 60 * 60 * 1000, // 31 days from now
            end: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
          },
          forVotes: 125,
          againstVotes: 15,
          totalDaoMembers: 230,
          image:
            "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          state: "Active", // Active, Approved, Rejected, Completed
          voters: [
            {
              address: "0x1234567890123456789012345678901234567890",
              vote: "for",
              timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
            },
            {
              address: "0x2345678901234567890123456789012345678901",
              vote: "for",
              timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            },
            {
              address: "0x3456789012345678901234567890123456789012",
              vote: "against",
              timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
            },
            {
              address: "0x4567890123456789012345678901234567890123",
              vote: "for",
              timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
            },
            {
              address: "0x5678901234567890123456789012345678901234",
              vote: "for",
              timestamp: Date.now() - 12 * 60 * 60 * 1000,
            },
          ],
          eligibilityCriteria: [
            "Must be a resident within the affected area",
            "Must provide proof of residence",
            "Must have experienced property damage or displacement",
            "One application per household",
          ],
        }

        // Simulate API delay
        setTimeout(() => {
          setProposal(mockProposal)
          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error fetching proposal:", err)
        setError("Failed to load proposal details. Please try again later.")
        setLoading(false)
      }
    }

    fetchProposal()
  }, [id])

  // Check if user has already voted
  useEffect(() => {
    if (proposal) {
      // In a real app, this would check if the user's wallet address is in the voters list
      setHasUserVoted(false)
    }
  }, [proposal])

  const handleVote = (voteType) => {
    setIsVoteModalOpen(true)
  }

  const confirmVote = (voteType) => {
    // In a real app, this would call a smart contract function
    setProposal((prev) => ({
      ...prev,
      forVotes: voteType === "for" ? prev.forVotes + 1 : prev.forVotes,
      againstVotes: voteType === "against" ? prev.againstVotes + 1 : prev.againstVotes,
      voters: [
        ...prev.voters,
        {
          address: "0x9876543210987654321098765432109876543210", // Mock user address
          vote: voteType,
          timestamp: Date.now(),
        },
      ],
    }))
    setHasUserVoted(true)
    setIsVoteModalOpen(false)
  }

  const getVotePercentage = () => {
    if (!proposal) return 0
    const totalVotes = proposal.forVotes + proposal.againstVotes
    return totalVotes > 0 ? Math.round((proposal.forVotes / totalVotes) * 100) : 0
  }

  const getApprovalStatus = () => {
    if (!proposal) return { status: "Pending", color: "bg-gray-500" }

    const totalVotes = proposal.forVotes + proposal.againstVotes
    const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0
    const quorum = (proposal.forVotes + proposal.againstVotes) / proposal.totalDaoMembers

    if (proposal.state === "Completed") {
      return forPercentage >= 60
        ? { status: "Approved", color: "bg-green-500" }
        : { status: "Rejected", color: "bg-red-500" }
    }

    if (forPercentage >= 60 && quorum >= 0.1) {
      return { status: "Passing", color: "bg-green-500" }
    } else if (forPercentage < 40) {
      return { status: "Failing", color: "bg-red-500" }
    } else {
      return { status: "Close", color: "bg-yellow-500" }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading proposal details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dao")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Return to Proposals
          </button>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Proposal Not Found</h2>
          <p className="text-gray-600 mb-4">The proposal you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/dao")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Return to Proposals
          </button>
        </div>
      </div>
    )
  }

  const approvalStatus = getApprovalStatus()
  const votePercentage = getVotePercentage()
  const totalVotes = proposal.forVotes + proposal.againstVotes
  const quorumPercentage = Math.round((totalVotes / proposal.totalDaoMembers) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/dao")}
          className="mb-6 flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Proposals</span>
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Main Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Header with Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-64 sm:h-80">
                <img
                  src={proposal.image || "/placeholder.svg"}
                  alt={proposal.disasterName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <ProposalStatusBadge state={proposal.state} />
                    <span className="text-sm opacity-80">Proposal #{proposal.id}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{proposal.disasterName}</h1>
                  <p className="text-sm sm:text-base opacity-90 mt-1">{proposal.area}</p>
                </div>
              </div>

              {/* Proposal Description */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Proposal</h2>
                <p className="text-gray-600">{proposal.description}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Funds Requested</p>
                      <p className="font-semibold">{formatCurrency(proposal.fundsRequested)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Proposer</p>
                      <p className="font-semibold">{formatAddress(proposal.proposer)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Proposal Date</p>
                      <p className="font-semibold">{formatDate(proposal.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Voting Ends</p>
                      <p className="font-semibold">{formatDate(proposal.endTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 pb-3">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                  <MapPin className="w-5 h-5 text-green-500 mr-2" />
                  Affected Area
                </h2>
                <p className="text-gray-600 mb-4">
                  This proposal covers a {proposal.location.radius} km radius around the following location:
                </p>
              </div>
              <div className="h-[400px] relative">
                <MapContainer
                  center={[proposal.location.latitude, proposal.location.longitude]}
                  zoom={8}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[proposal.location.latitude, proposal.location.longitude]}>
                    <Popup>
                      <div className="text-center">
                        <strong>{proposal.disasterName}</strong>
                        <div className="text-xs mt-1">
                          {proposal.location.latitude}, {proposal.location.longitude}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={[proposal.location.latitude, proposal.location.longitude]}
                    radius={proposal.location.radius * 1000}
                    pathOptions={{
                      color: "red",
                      fillColor: "red",
                      fillOpacity: 0.2,
                      weight: 2,
                      dashArray: "5, 5",
                    }}
                  />
                </MapContainer>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Coordinates:</span> {proposal.location.latitude.toFixed(4)},{" "}
                    {proposal.location.longitude.toFixed(4)}
                  </div>
                  <div>
                    <span className="font-medium">Coverage Radius:</span> {proposal.location.radius} km
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Eligibility Criteria */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Eligibility Criteria
                </h2>
                <p className="text-gray-600 mb-4">
                  If this proposal is approved, the following criteria will determine who can register for aid:
                </p>
                <ul className="space-y-2">
                  {proposal.eligibilityCriteria.map((criterion, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="ml-2 text-gray-700">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-green-500 mr-2" />
                  Timeline
                </h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  {/* Timeline items */}
                  <div className="space-y-8">
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-green-100 rounded-full z-10 text-green-600">
                        <Calendar className="h-8 w-8" />
                      </div>
                      <div className="ml-4 pt-2">
                        <h3 className="text-lg font-medium text-gray-900">Proposal Period</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(proposal.startTime)} - {formatDate(proposal.endTime)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          DAO members vote on whether to approve this proposal
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-blue-100 rounded-full z-10 text-blue-600">
                        <Users className="h-8 w-8" />
                      </div>
                      <div className="ml-4 pt-2">
                        <h3 className="text-lg font-medium text-gray-900">Registration Period</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(proposal.registrationPeriod.start)} -{" "}
                          {formatDate(proposal.registrationPeriod.end)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          If approved, affected individuals can register for aid
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-yellow-100 rounded-full z-10 text-yellow-600">
                        <DollarSign className="h-8 w-8" />
                      </div>
                      <div className="ml-4 pt-2">
                        <h3 className="text-lg font-medium text-gray-900">Claiming Period</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(proposal.claimingPeriod.start)} - {formatDate(proposal.claimingPeriod.end)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Verified registrants can claim their allocated funds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Voting & Stats */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Voting Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Proposal Voting</h2>

                {/* Approval Status */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Approval Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${approvalStatus.color}`}>
                      {approvalStatus.status}
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${votePercentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{votePercentage}% Approval</span>
                    <span>60% Required</span>
                  </div>
                </div>

                {/* Vote Counts */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{proposal.forVotes}</div>
                    <div className="text-sm text-gray-600">For</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{proposal.againstVotes}</div>
                    <div className="text-sm text-gray-600">Against</div>
                  </div>
                </div>

                {/* Quorum Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Quorum Progress</span>
                    <span className="text-sm font-medium">
                      {totalVotes} of {proposal.totalDaoMembers} Members
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${quorumPercentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{quorumPercentage}% Participated</span>
                    <span>10% Minimum Required</span>
                  </div>
                </div>

                {/* Voting Actions */}
                {proposal.state === "Active" && (
                  <div>
                    {isUserDaoMember ? (
                      hasUserVoted ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <p className="text-gray-600">You have already voted on this proposal</p>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleVote("for")}
                            className="flex-1 py-3 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
                          >
                            <ThumbsUp className="h-5 w-5 mr-2" />
                            Vote For
                          </button>
                          <button
                            onClick={() => handleVote("against")}
                            className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <ThumbsDown className="h-5 w-5 mr-2" />
                            Vote Against
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                        <p className="text-gray-700">Only DAO members can vote on proposals</p>
                        <button className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
                          Learn how to join
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {proposal.state !== "Active" && (
                  <div
                    className={`rounded-lg p-4 text-center ${
                      proposal.state === "Approved"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {proposal.state === "Approved" ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    )}
                    <p className="text-gray-700">
                      This proposal has been{" "}
                      <span
                        className={
                          proposal.state === "Approved" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                        }
                      >
                        {proposal.state.toLowerCase()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Voters */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Voters</h2>
                  <button
                    onClick={() => setShowAllVoters(!showAllVoters)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {showAllVoters ? "Show Less" : "View All"}
                  </button>
                </div>

                <ProposalVotersList
                  voters={showAllVoters ? proposal.voters : proposal.voters.slice(0, 3)}
                  showAll={showAllVoters}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Vote Confirmation Modal */}
      {isVoteModalOpen && (
        <ProposalVoteModal onClose={() => setIsVoteModalOpen(false)} onConfirm={confirmVote} proposal={proposal} />
      )}
    </div>
  )
}

export default ProposalDetails
