"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletConnection from "./regis_components/WalletConnection";
import AadharVerification from "./regis_components/AadharVerification";
import Registration from "./regis_components/Registration";
import InfoModal from "./regis_components/InfoModal";
import SuccessModal from "./regis_components/SuccessModal";
import ThemeToggle from "./regis_components/ThemeToggle";

const VictimRegistration = () => {
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
  const contractAddress = "0x6B93a13b8D08Cd5893141DF090e2e53A1B7c08d9"; // Replace with actual contract address

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
            Disaster Relief Registration
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
                  contractAddress={contractAddress}
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
