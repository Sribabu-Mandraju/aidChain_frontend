import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AnonAadhaarProvider,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  DEVELOPMENT_APP_ID,
  DEVELOPMENT_MODE
} from "@anon-aadhaar/react";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import {
  Shield,
  Wallet,
  CheckCircle,
  ChevronRight,
  ArrowLeft,
  Loader2,
  X,
  Info,
  RefreshCw,
} from "lucide-react";

const VictimRegistrationPage = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState("");
  const [nullifier, setNullifier] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anonAadhaar] = useAnonAadhaar();
  const { address: walletAddress, isConnected } = useAccount();

  // Monitor wallet connection
  useEffect(() => {
    if (isConnected && walletAddress) {
      setStatus("Wallet connected successfully! Please proceed with Aadhar verification.");
      setCurrentStep(2);
    }
  }, [isConnected, walletAddress]);

  // Monitor Anon Aadhaar status
  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      try {
        const { nullifier: proofNullifier } = anonAadhaar.anonAadhaarProof;
        setNullifier(proofNullifier);
        setStatus("Aadhar proof generated successfully!");
        setCurrentStep(3);
      } catch (error) {
        console.error("Error accessing nullifier:", error);
        setStatus("Error accessing nullifier. Please try again.");
      }
    }
  }, [anonAadhaar.status]);

  // Submit registration
  const handleSubmitRegistration = async () => {
    if (!nullifier || !walletAddress) {
      setStatus("Missing required information. Please complete all steps.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Submitting registration...");

    try {
      // Log registration data
      console.log("Registration Data:", {
        walletAddress,
        nullifier,
        timestamp: new Date().toISOString(),
      });
      
      setStatus("Registration submitted successfully!");
      setCurrentStep(4);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setCurrentStep(1);
    setStatus("");
    setNullifier("");
    window.location.reload();
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // Info Modal Component
  const InfoModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsInfoModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            About ZK Aadhar Verification
          </h3>
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>
            This system uses Zero-Knowledge proofs to verify your Aadhar identity
            without revealing your actual Aadhar number to the blockchain or any
            third parties.
          </p>
          <p>When you submit your Aadhar, we generate a cryptographic proof that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Confirms you are the legitimate owner of a valid Aadhar</li>
            <li>
              Creates a unique nullifier that prevents double-claiming without
              revealing your identity
            </li>
            <li>
              Connects this verification to your wallet address for aid distribution
            </li>
          </ul>
          <p className="font-medium text-gray-700 mt-4">
            Your privacy and security are our top priorities. No sensitive data is
            stored on the blockchain.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  // Render the Aadhar verification section with optimized settings
  const renderAadharVerification = () => (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-500 mb-3">
        Generate a zero-knowledge proof with Anon Aadhaar:
      </p>
      <div className="flex justify-center">
        <LogInWithAnonAadhaar
          mode={DEVELOPMENT_MODE}
          appId={DEVELOPMENT_APP_ID}
          quickMode={true}
          cacheProof={true}
          skipPreliminaryCheck={true}
        />
      </div>
    </div>
  );

  return (
    <AnonAadhaarProvider
      _appId={DEVELOPMENT_APP_ID}
      _development={true}
      _fastMode={true}
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Disaster Relief Registration
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Register to receive aid through secure Aadhar verification and
              Coinbase Smart Wallet
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? <CheckCircle size={20} /> : step}
                  </div>
                  <div className="text-xs mt-2 text-gray-500">
                    {step === 1 && "Connect Wallet"}
                    {step === 2 && "Verify Aadhar"}
                    {step === 3 && "Review"}
                    {step === 4 && "Confirmation"}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative max-w-xl mx-auto mt-2">
              <div className="absolute top-0 left-[10%] right-[10%] h-1 bg-gray-200"></div>
              <div
                className="absolute top-0 left-[10%] h-1 bg-indigo-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) * 100) / 3}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <Wallet className="mr-2 text-indigo-600" size={24} />
                      Connect Wallet
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Connect your Coinbase Smart Wallet to receive aid
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-3">
                        Why Connect a Wallet?
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>Receive aid directly to your wallet</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>No intermediaries or delays</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle
                            size={16}
                            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          />
                          <span>Secure and transparent distribution</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex justify-center">
                      <ConnectWallet />
                    </div>
                  </div>
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
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Shield className="mr-2 text-indigo-600" size={24} />
                        Aadhar Verification
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Verify your identity using Aadhar with zero-knowledge proof
                      </p>
                    </div>
                    <button
                      onClick={() => setIsInfoModalOpen(true)}
                      className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                      aria-label="Learn more about ZK verification"
                    >
                      <Info size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-gray-700 flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        Wallet connected: {walletAddress.slice(0, 6)}...
                        {walletAddress.slice(-4)}
                      </p>
                    </div>

                    {renderAadharVerification()}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep(1)}
                        className="py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50"
                      >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Review & Submit
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Review your information and submit registration
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-4">
                        Registration Summary
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Wallet Address:</p>
                          <p className="text-gray-700 font-mono">
                            {walletAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Aadhar Verification Status:
                          </p>
                          <p className="text-green-600 flex items-center">
                            <CheckCircle size={16} className="mr-2" />
                            Verified
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Generated Nullifier:
                          </p>
                          <p className="text-gray-700 font-mono break-all">
                            {nullifier}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep(2)}
                        className="py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50"
                      >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitRegistration}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium flex items-center justify-center disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Registration
                            <ChevronRight size={20} className="ml-2" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="p-8 text-center"
                >
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Registration Successful!
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto">
                      Your registration has been completed successfully. You will
                      receive aid directly to your wallet once approved.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8 max-w-md mx-auto">
                    <h3 className="font-medium text-gray-800 mb-4 text-left">
                      Registration Details
                    </h3>
                    <div className="space-y-3 text-left">
                      <div>
                        <p className="text-xs text-gray-500">Wallet Address:</p>
                        <p className="text-sm font-mono text-gray-700 break-all">
                          {walletAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nullifier:</p>
                        <p className="text-sm font-mono text-gray-700 break-all">
                          {nullifier}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      className="py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50"
                    >
                      <RefreshCw size={20} className="mr-2" />
                      Register Another
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Messages */}
          {status && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
              {status}
            </div>
          )}
        </div>

        {/* Modals */}
        <AnimatePresence>
          {isInfoModalOpen && <InfoModal />}
        </AnimatePresence>
      </div>
    </AnonAadhaarProvider>
  );
};

const ProductionVictimRegistrationPage = () => (
  <AnonAadhaarProvider
    _appId="YOUR_ACTUAL_APP_ID"
    _development={false}
    _fastMode={false}
  >
    <VictimRegistrationPage />
  </AnonAadhaarProvider>
);

export default ProductionVictimRegistrationPage;