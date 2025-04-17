"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import WalletConnection from "./regis_components/WalletConnection";
import AadharVerification from "./regis_components/AadharVerification";
import Registration from "./regis_components/Registration";
import InfoModal from "./regis_components/InfoModal";
import SuccessModal from "./regis_components/SuccessModal";
import ThemeToggle from "./regis_components/ThemeToggle";
import { getCampaignDetails, getDonationEndTime, getAmountPerVictim } from "../../providers/disasterRelief_provider";

const VictimRegistration = () => {
  // Get campaign ID from URL params
  const { id } = useParams();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [nullifier, setNullifier] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campaign details
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        // Get all campaign details in parallel
        const [
          campaignDetails,
          donationEndTime,
          amountPerVictim
        ] = await Promise.all([
          getCampaignDetails(id),
          getDonationEndTime(id),
          getAmountPerVictim(id)
        ]);

        // Map state to status
        const statusMap = {
          0: "Active",
          1: "Registration",
          2: "Waiting",
          3: "Distribution",
          4: "Closed"
        };

        // Calculate days left based on donation end time
        const currentTime = Math.floor(Date.now() / 1000);
        const secondsLeft = Number(donationEndTime) - currentTime;
        const daysLeft = secondsLeft > 0 ? Math.ceil(secondsLeft / (24 * 60 * 60)) : 0;

        // Format location string
        const locationString = [
          campaignDetails.location.country,
          campaignDetails.location.state,
          campaignDetails.location.city
        ]
          .filter(Boolean)
          .join(", ");

        // Construct campaign object using the campaignDetails structure
        const campaign = {
          id: id,
          title: campaignDetails.disasterName,
          description: `Location: ${locationString || 'Unknown'}`,
          image: campaignDetails.image || campaignDetails.location.image || "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          status: statusMap[campaignDetails.state] || "Unknown",
          totalDonations: `${(Number(campaignDetails.totalFunds) / 1e6).toFixed(2)} USDC`,
          goal: "N/A",
          progress: 0,
          donors: campaignDetails.totalDonors,
          victimsCount: campaignDetails.totalVictimsRegistered,
          daysLeft: daysLeft,
          latitude: campaignDetails.location.latitude || "0",
          longitude: campaignDetails.location.longitude || "0",
          radius: campaignDetails.location.radius || "10",
          contractAddress: id,
          amountPerVictim: `${(Number(amountPerVictim) / 1e6).toFixed(2)} USDC`,
          disasterId: campaignDetails.disasterId
        };

        setCampaign(campaign);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError("Failed to load campaign details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const R = 6371; // Earth's radius in kilometers
    return R * c;
  };

  // Function to verify location against campaign coordinates
  const verifyLocation = async (userLat, userLon) => {
    if (!campaign) return false;

    try {
      // Get campaign coordinates and radius
      const campaignLat = Number.parseFloat(campaign.latitude);
      const campaignLon = Number.parseFloat(campaign.longitude);
      const campaignRadius = Number.parseFloat(campaign.radius);

      if (isNaN(campaignLat) || isNaN(campaignLon) || isNaN(campaignRadius)) {
        return false;
      }

      // Calculate distance from campaign center
      const distance = calculateDistance(userLat, userLon, campaignLat, campaignLon);

      // Add a small buffer (2% of radius) to account for GPS inaccuracy
      const buffer = Math.max(0.1, campaignRadius * 0.02);

      // Check if user is within the affected area
      const isInside = distance <= campaignRadius + buffer;

      console.log("\n=== LOCATION VERIFICATION ===");
      console.log("Campaign Center:", { lat: campaignLat, lon: campaignLon });
      console.log("User Location:", { lat: userLat, lon: userLon });
      console.log("Distance:", distance.toFixed(2), "km");
      console.log("Allowed Radius:", campaignRadius + buffer, "km");
      console.log("Status:", isInside ? "INSIDE ✅" : "OUTSIDE ❌");

      return isInside;
    } catch (error) {
      console.error("Location verification error:", error);
      return false;
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // Reset the form to start over
  const handleReset = () => {
    setCurrentStep(1);
    setWalletAddress("");
    setIsAadhaarVerified(false);
    setNullifier("");
    setStatus("");
    setLocation(null);
    setShowSuccessModal(false);
    window.location.reload(); // Reload to reset Anon Aadhaar state
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Campaign not found</div>
          <button
            onClick={() => window.location.href = "/campaigns"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } py-12 px-4 sm:px-6 transition-colors duration-300`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {campaign.title} - Victim Registration
          </h1>
          <p
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } max-w-xl mx-auto`}
          >
            Register to receive aid through secure Aadhar verification and
            Coinbase Smart Wallet
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? isDarkMode
                        ? "bg-gray-100 text-gray-900"
                        : "bg-gray-900 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? (
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
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {step === 1 && "Connect Wallet"}
                  {step === 2 && "Verify Aadhar"}
                  {step === 3 && "Register"}
                </div>
              </div>
            ))}
          </div>
          <div className="relative max-w-xl mx-auto mt-2">
            <div
              className={`absolute top-0 left-[10%] right-[10%] h-1 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`absolute top-0 left-[10%] h-1 ${
                isDarkMode ? "bg-gray-300" : "bg-gray-900"
              } transition-all duration-500`}
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200 shadow-xl"
          } rounded-2xl overflow-hidden`}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Connect Wallet */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-8"
              >
                <WalletConnection
                  isDarkMode={isDarkMode}
                  setCurrentStep={setCurrentStep}
                  walletAddress={walletAddress}
                  setWalletAddress={setWalletAddress}
                  status={status}
                  setStatus={setStatus}
                />
              </motion.div>
            )}

            {/* Step 2: Aadhar Verification */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-8"
              >
                <AadharVerification
                  isDarkMode={isDarkMode}
                  setCurrentStep={setCurrentStep}
                  setIsAadhaarVerified={setIsAadhaarVerified}
                  isAadhaarVerified={isAadhaarVerified}
                  setNullifier={setNullifier}
                  status={status}
                  setStatus={setStatus}
                  setIsInfoModalOpen={setIsInfoModalOpen}
                  contractAddress={id}
                  verifyLocation={verifyLocation}
                />
              </motion.div>
            )}

            {/* Step 3: Registration */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-8"
              >
                <Registration
                  isDarkMode={isDarkMode}
                  setCurrentStep={setCurrentStep}
                  setShowSuccessModal={setShowSuccessModal}
                  status={status}
                  setStatus={setStatus}
                  setLocation={setLocation}
                  verifyLocation={verifyLocation}
                  isAadhaarVerified={isAadhaarVerified}
                  walletAddress={walletAddress}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@example.com"
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } hover:underline`}
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {isInfoModalOpen && (
          <InfoModal
            isDarkMode={isDarkMode}
            setIsInfoModalOpen={setIsInfoModalOpen}
          />
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            isDarkMode={isDarkMode}
            setShowSuccessModal={setShowSuccessModal}
            walletAddress={walletAddress}
            nullifier={nullifier}
            location={location}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VictimRegistration;
