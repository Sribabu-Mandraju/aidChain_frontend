"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const Registration = ({ 
  isDarkMode, 
  setCurrentStep, 
  setShowSuccessModal, 
  status, 
  setStatus, 
  setLocation, 
  verifyLocation,
  isAadhaarVerified,
  walletAddress
}) => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Check if all verifications are complete
  const isAllVerified = isAadhaarVerified && walletAddress;

  // Get user's geolocation
  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  // Handle registration
  const handleRegistration = async () => {
    if (!isAllVerified) return;

    setIsRegistering(true)
    setStatus("Processing registration...")

    try {
      // Get geolocation
      const geoData = await getGeolocation()
      setUserLocation(geoData)
      setLocation(geoData)

      // Log registration data to console
      console.log("Registration Data:", {
        location: geoData,
        walletAddress,
        isAadhaarVerified
      })

      // Simulate registration process
      setTimeout(() => {
        setShowSuccessModal(true)
        setStatus("Registration successful!")
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error)
      setStatus(`Registration failed: ${error.message}`)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Complete Registration
        </h2>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
          Finalize your registration to receive disaster relief aid
        </p>
      </div>

      <div className="space-y-6">
        {/* Verification Status Cards */}
        <div
          className={`${
            isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
          } rounded-lg p-6 border`}
        >
          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>Verification Status</h3>
          
          {/* Aadhaar Verification Status */}
          <div className={`mb-4 p-4 rounded-lg ${
            isAadhaarVerified 
              ? isDarkMode ? "bg-green-900 border-green-800" : "bg-green-50 border-green-100"
              : isDarkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100 border-gray-200"
          } border`}>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`mr-3 ${isAadhaarVerified ? "text-green-500" : "text-gray-400"}`}
              >
                {isAadhaarVerified ? (
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                ) : (
                  <circle cx="12" cy="12" r="10"></circle>
                )}
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Aadhaar Verification
                </h4>
                <p className={`text-sm ${isAadhaarVerified ? (isDarkMode ? "text-green-300" : "text-green-700") : (isDarkMode ? "text-gray-400" : "text-gray-500")}`}>
                  {isAadhaarVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Connection Status */}
          <div className={`p-4 rounded-lg ${
            walletAddress 
              ? isDarkMode ? "bg-green-900 border-green-800" : "bg-green-50 border-green-100"
              : isDarkMode ? "bg-gray-600 border-gray-500" : "bg-gray-100 border-gray-200"
          } border`}>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`mr-3 ${walletAddress ? "text-green-500" : "text-gray-400"}`}
              >
                {walletAddress ? (
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                ) : (
                  <circle cx="12" cy="12" r="10"></circle>
                )}
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Wallet Connection
                </h4>
                <p className={`text-sm ${walletAddress ? (isDarkMode ? "text-green-300" : "text-green-700") : (isDarkMode ? "text-gray-400" : "text-gray-500")}`}>
                  {walletAddress ? "Connected" : "Not Connected"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div
          className={`${
            isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
          } rounded-lg p-6 border`}
        >
          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>Location Information</h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
            Your location has been verified in the previous step. This will be used to confirm your eligibility for aid.
          </p>
          {userLocation && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Current Location: Lat {userLocation.latitude.toFixed(4)}, Lon {userLocation.longitude.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentStep(2)}
            className={`py-3 px-4 rounded-lg ${
              isDarkMode
                ? "border border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            } font-medium flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegistration}
            disabled={isRegistering || !isAllVerified}
            className={`flex-1 py-3 px-4 rounded-lg ${
              isDarkMode
                ? !isAllVerified
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
                : !isAllVerified
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
            } font-medium flex items-center justify-center disabled:cursor-not-allowed`}
          >
            {isRegistering ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 animate-spin"
                >
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                Registering...
              </>
            ) : (
              <>
                Register
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </>
            )}
          </motion.button>
        </div>

        {status && (
          <div
            className={`p-3 rounded-lg ${
              isDarkMode ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-50 text-gray-700 border-gray-200"
            } border`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  )
}

export default Registration
  