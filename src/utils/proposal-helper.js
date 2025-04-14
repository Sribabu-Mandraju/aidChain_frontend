// Calculate the approval percentage for a proposal
export const calculateApprovalPercentage = (forVotes, againstVotes) => {
    const totalVotes = forVotes + againstVotes
    return totalVotes > 0 ? Math.round((forVotes / totalVotes) * 100) : 0
  }
  
  // Determine if a proposal has reached quorum
  export const hasReachedQuorum = (totalVotes, totalMembers, requiredQuorum = 0.1) => {
    return totalVotes / totalMembers >= requiredQuorum
  }
  
  // Determine if a proposal has passed
  export const hasProposalPassed = (
    forVotes,
    againstVotes,
    totalMembers,
    requiredApproval = 0.6,
    requiredQuorum = 0.1,
  ) => {
    const totalVotes = forVotes + againstVotes
    const approvalPercentage = calculateApprovalPercentage(forVotes, againstVotes) / 100
    const quorumPercentage = totalVotes / totalMembers
  
    return approvalPercentage >= requiredApproval && quorumPercentage >= requiredQuorum
  }
  
  // Get the status of a proposal
  export const getProposalStatus = (proposal) => {
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
  
  // Check if a user is eligible to register for a campaign
  export const isUserEligible = (userLocation, proposalLocation, userProofs = []) => {
    // Calculate distance between user and proposal center
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      proposalLocation.latitude,
      proposalLocation.longitude,
    )
  
    // Check if user is within the radius
    const isWithinRadius = distance <= proposalLocation.radius
  
    // Check if user has provided all required proofs
    const hasRequiredProofs = userProofs.length > 0
  
    return isWithinRadius && hasRequiredProofs
  }
  
  // Calculate distance between two points using Haversine formula
  export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }
  
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }
  