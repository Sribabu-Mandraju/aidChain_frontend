"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { toast } from "react-hot-toast"
import { LogInWithAnonAadhaar, useAnonAadhaar, useProver } from "@anon-aadhaar/react"

const VictimRegistrationModal = ({ campaign, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [locationVerified, setLocationVerified] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [verificationStatus, setVerificationStatus] = useState("idle")
  const [aadhaarError, setAadhaarError] = useState(null)

  const [anonAadhaar] = useAnonAadhaar()
  const [, latestProof] = useProver()

  // Improved function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Convert latitude and longitude from degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180)

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    // Convert coordinates to radians
    const lat1Rad = toRadians(lat1)
    const lat2Rad = toRadians(lat2)

    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    // Earth's radius in kilometers
    const R = 6371

    // Distance in kilometers
    return R * c
  }

  // Function to verify user's location
  const verifyLocation = () => {
    console.log("Starting location verification...")

    if (!navigator.geolocation) {
      console.error("Geolocation not supported")
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          console.log("Got user position:", position)

          const userLat = position.coords.latitude
          const userLon = position.coords.longitude
          setUserLocation({ latitude: userLat, longitude: userLon })

          // Ensure campaign coordinates are valid numbers
          const campaignLat = Number.parseFloat(campaign.latitude)
          const campaignLon = Number.parseFloat(campaign.longitude)
          const campaignRadius = Number.parseFloat(campaign.radius) // Radius is already in kilometers

          console.log("\n\n=== LOCATION VERIFICATION DETAILS ===")
          console.log("----------------------------------------")
          console.log("DISASTER CENTER POINT:")
          console.log("Latitude:", campaignLat)
          console.log("Longitude:", campaignLon)
          console.log("Radius:", campaignRadius, "km")
          console.log("----------------------------------------")
          console.log("YOUR CURRENT LOCATION:")
          console.log("Latitude:", userLat)
          console.log("Longitude:", userLon)
          console.log("----------------------------------------")

          if (isNaN(campaignLat) || isNaN(campaignLon) || isNaN(campaignRadius)) {
            console.error("Invalid coordinates:", { campaignLat, campaignLon, campaignRadius })
            throw new Error("Invalid campaign location data")
          }

          // Calculate distance using the improved Haversine formula
          const distance = calculateDistance(userLat, userLon, campaignLat, campaignLon)

          console.log("\n=== DISTANCE CALCULATION ===")
          console.log("Distance from center:", distance.toFixed(2), "km")
          console.log("Allowed radius:", campaignRadius, "km")

          // Add a small buffer (2% of radius) to account for GPS inaccuracy
          const buffer = Math.max(0.1, campaignRadius * 0.02) // At least 100 meters buffer
          const isInside = distance <= campaignRadius + buffer

          console.log("\n=== VERIFICATION RESULT ===")
          console.log("Distance from center:", distance.toFixed(2), "km")
          console.log("Allowed radius with buffer:", (campaignRadius + buffer).toFixed(2), "km")
          console.log("Status:", isInside ? "INSIDE disaster area ✅" : "OUTSIDE disaster area ❌")

          if (isInside) {
            console.log("\n✅ Location verified successfully!")
            setLocationVerified(true)
            setError("")
            toast.success(`Location verified successfully! (${distance.toFixed(2)} km from center)`)
          } else {
            console.log("\n❌ Location verification failed")
            setLocationVerified(false)
            setError(
              `Your location is ${distance.toFixed(2)} km from the disaster center, which is outside the allowed radius of ${campaignRadius} km. Please move closer to the disaster area to register.`,
            )
            toast.error("Location verification failed")
          }
        } catch (error) {
          console.error("Location verification error:", error)
          setError("Error verifying location. Please try again.")
          toast.error("Location verification failed")
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        let errorMessage = "Unable to retrieve your location. "
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location services in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again."
            break
          default:
            errorMessage += "Please ensure location services are enabled."
        }
        setError(errorMessage)
        setIsLoading(false)
        toast.error("Failed to get location")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  // Handle Aadhaar verification status
  useEffect(() => {
    console.log("Anon Aadhaar status:", anonAadhaar.status)
    console.log("Anon Aadhaar proof:", anonAadhaar.anonAadhaarProof)
    console.log("Latest proof:", latestProof)

    if (anonAadhaar.status === "logged-in") {
      console.log("Aadhaar verification successful!")
      setVerificationStatus("success")
      setAadhaarError(null)
      toast.success("Aadhaar verification successful!")
    } else if (anonAadhaar.status === "error") {
      console.error("Aadhaar verification error:", anonAadhaar.error)
      setVerificationStatus("error")
      setAadhaarError(anonAadhaar.error || "Verification failed. Please try again.")
      toast.error("Aadhaar verification failed")
    } else if (anonAadhaar.status === "logging-in") {
      console.log("Generating Aadhaar proof...")
      setVerificationStatus("processing")
      setAadhaarError(null)
    }
  }, [anonAadhaar, latestProof])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Register as Victim for {campaign.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Location Verification Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Step 1: Verify Location</h4>
            <button
              onClick={verifyLocation}
              disabled={isLoading || locationVerified}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                isLoading || locationVerified
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">Verifying Location...</span>
                </div>
              ) : locationVerified ? (
                <div className="flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Location Verified
                </div>
              ) : (
                "Verify Location"
              )}
            </button>
            {userLocation && (
              <p className="text-sm text-gray-600">
                Current Location: Lat {userLocation.latitude.toFixed(4)}, Lon {userLocation.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Aadhaar Verification Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Step 2: Verify Aadhaar</h4>
            <div className="w-full">
              <LogInWithAnonAadhaar
                nullifierSeed={1234}
                fieldsToReveal={[]}
                _useTestAadhaar={true}
                signal={1234}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  verificationStatus === "success"
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              />
            </div>
            {verificationStatus === "processing" && (
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                <span>Verifying Aadhaar...</span>
              </div>
            )}
            {aadhaarError && <div className="text-red-600 bg-red-50 p-3 rounded-lg">{aadhaarError}</div>}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
              <pre className="text-xs text-gray-600">
                Location Verified: {locationVerified ? "Yes" : "No"}
                {userLocation && `\nCurrent Location: ${JSON.stringify(userLocation)}`}
                {anonAadhaar?.status && `\nAadhaar Status: ${anonAadhaar.status}`}
                {latestProof && `\nProof Available: Yes`}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VictimRegistrationModal
