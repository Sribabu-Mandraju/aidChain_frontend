"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnonAadhaarProvider, LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react"
import QrScanner from "react-qr-scanner"
import { Shield, Wallet, CheckCircle, ChevronRight, ArrowLeft, Loader2, QrCode, X, Info, MapPin } from "lucide-react"

// Mock Coinbase Smart Wallet connection (replace with actual implementation)
const connectCoinbaseWallet = async () => {
  // Simulate wallet connection
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomWallet =
        "0x" +
        Array(40)
          .fill()
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")
      resolve({
        success: true,
        address: randomWallet,
      })
    }, 2000)
  })
}

const VictimRegistrationContent = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1)
  const [showScanner, setShowScanner] = useState(false)
  const [qrData, setQrData] = useState("")
  const [status, setStatus] = useState("")
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [nullifier, setNullifier] = useState("")
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [anonAadhaar] = useAnonAadhaar()
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
  const [location, setLocation] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const contractAddress = "0x6B93a13b8D08Cd5893141DF090e2e53A1B7c08d9" // Replace with your actual contract address

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Handle QR code scanning
  const handleScan = (data) => {
    if (data && data.text) {
      setQrData(data.text)
      setShowScanner(false)
      setStatus("QR code scanned. Please use Anon Aadhaar login to generate proof.")
    }
  }

  const handleError = (err) => {
    console.error(err)
    setStatus("Error scanning QR code. Try uploading a file instead.")
  }

  // Monitor Anon Aadhaar status
  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      try {
        const { nullifier: proofNullifier } = anonAadhaar.anonAadhaarProof
        setNullifier(proofNullifier)
        console.log("Nullifier:", proofNullifier)
        setStatus(`Proof generated successfully!`)
        setIsAadhaarVerified(true)
      } catch (error) {
        console.error("Error accessing nullifier:", error)
        setStatus("Error accessing nullifier. Please try again.")
      }
    }
  }, [anonAadhaar.status])

  // Connect to Coinbase Smart Wallet
  const handleWalletConnection = async () => {
    setIsConnectingWallet(true)
    setStatus("Connecting to Coinbase Smart Wallet...")

    try {
      const walletData = await connectCoinbaseWallet()
      setWalletAddress(walletData.address)
      setStatus("Wallet connected successfully!")

      // Log the wallet address to console
      console.log("Wallet connected:", walletData.address)
    } catch (error) {
      console.error("Wallet connection error:", error)
      setStatus("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnectingWallet(false)
    }
  }

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
      )
    })
  }

  // Handle registration
  const handleRegistration = async () => {
    setIsRegistering(true)
    setStatus("Processing registration...")

    try {
      // Get geolocation
      const geoData = await getGeolocation()
      setLocation(geoData)

      // Log registration data to console
      console.log("Registration Data:", {
        walletAddress: walletAddress,
        nullifier: nullifier,
        location: geoData,
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

  // Reset the form to start over
  const handleReset = () => {
    setCurrentStep(1)
    setQrData("")
    setStatus("")
    setWalletAddress("")
    setNullifier("")
    setIsAadhaarVerified(false)
    setLocation(null)
    setShowSuccessModal(false)
    window.location.reload() // Reload to reset Anon Aadhaar state
  }

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  // Info Modal Component
  const InfoModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 ${isDarkMode ? "bg-gray-900/70" : "bg-black/50"} flex items-center justify-center z-50 p-4`}
      onClick={() => setIsInfoModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-2xl p-6 sm:p-8 max-w-md w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">About ZK Aadhar Verification</h3>
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4 text-gray-400">
          <p>
            This system uses Zero-Knowledge proofs to verify your Aadhar identity without revealing your actual Aadhar
            number to the blockchain or any third parties.
          </p>
          <p>When you submit your Aadhar, we generate a cryptographic proof that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Confirms you are the legitimate owner of a valid Aadhar</li>
            <li>Creates a unique nullifier that prevents double-claiming without revealing your identity</li>
            <li>Connects this verification to your wallet address for aid distribution</li>
          </ul>
          <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mt-4`}>
            Your privacy and security are our top priorities. No sensitive data is stored on the blockchain.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )

  // Success Modal Component
  const SuccessModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 ${isDarkMode ? "bg-gray-900/70" : "bg-black/50"} flex items-center justify-center z-50 p-4`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-2xl p-6 sm:p-8 max-w-md w-full text-center`}
      >
        <div
          className={`w-20 h-20 ${isDarkMode ? "bg-green-900" : "bg-green-100"} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Registration Successful!
        </h2>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-2 mb-6`}>
          Your registration has been completed successfully. You will receive aid directly to your wallet once approved.
        </p>

        <div
          className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-6 ${isDarkMode ? "border-gray-600" : "border-gray-200"} border mb-6 text-left`}
        >
          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-4`}>Registration Summary</h3>
          <div className="space-y-3">
            <div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Wallet Address:</p>
              <p className={`text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"} break-all`}>
                {walletAddress}
              </p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nullifier:</p>
              <p className={`text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"} break-all`}>
                {nullifier}
              </p>
            </div>
            {location && (
              <div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location:</p>
                <p className={`text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowSuccessModal(false)}
          className={`w-full py-3 px-4 rounded-lg ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300"
          } font-medium`}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } py-12 px-4 sm:px-6 transition-colors duration-300`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
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
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
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
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2`}>
            Disaster Relief Registration
          </h1>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} max-w-xl mx-auto`}>
            Register to receive aid through secure Aadhar verification and Coinbase Smart Wallet
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
                  {currentStep > step ? <CheckCircle size={20} /> : step}
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {step === 1 && "Connect Wallet"}
                  {step === 2 && "Verify Aadhar"}
                  {step === 3 && "Register"}
                </div>
              </div>
            ))}
          </div>
          <div className="relative max-w-xl mx-auto mt-2">
            <div
              className={`absolute top-0 left-[10%] right-[10%] h-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
            ></div>
            <div
              className={`absolute top-0 left-[10%] h-1 ${isDarkMode ? "bg-gray-300" : "bg-gray-900"} transition-all duration-500`}
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`${
            isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-xl"
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
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}>
                    <Wallet className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`} size={24} />
                    Connect Wallet
                  </h2>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                    Connect your Coinbase Smart Wallet to begin the registration process
                  </p>
                </div>

                <div
                  className={`${
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                  } rounded-lg p-6 border mb-6`}
                >
                  <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>
                    Why Connect a Wallet?
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                        Receive aid directly to your wallet
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                        No intermediaries or delays
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                        Secure and transparent distribution
                      </span>
                    </li>
                  </ul>
                </div>

                {!walletAddress ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWalletConnection}
                    disabled={isConnectingWallet}
                    className={`w-full py-3 px-4 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
                        : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
                    } font-medium flex items-center justify-center disabled:cursor-not-allowed`}
                  >
                    {isConnectingWallet ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Connect Coinbase Wallet
                        <Wallet size={20} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`${
                        isDarkMode ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-100"
                      } rounded-lg p-4 border`}
                    >
                      <div className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                            Wallet Successfully Connected
                          </h3>
                          <div className="mt-2 bg-gray-800 p-3 rounded border border-gray-700 break-all">
                            <p className="text-xs text-gray-400 mb-1">Wallet Address:</p>
                            <p className="text-sm font-mono text-gray-300">{walletAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(2)}
                      className={`w-full py-3 px-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      } font-medium flex items-center justify-center`}
                    >
                      Continue to Verification
                      <ChevronRight size={20} className="ml-2" />
                    </motion.button>
                  </div>
                )}

                {status && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 border-gray-600"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    } border`}
                  >
                    {status}
                  </div>
                )}
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
                    <h2
                      className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}
                    >
                      <Shield className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`} size={24} />
                      Aadhar Verification
                    </h2>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                      Verify your identity using Aadhar with zero-knowledge proof
                    </p>
                  </div>
                  <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className={`${
                      isDarkMode
                        ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    } p-1 rounded-full`}
                    aria-label="Learn more about ZK verification"
                  >
                    <Info size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div
                    className={`${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                    } rounded-lg p-4 border`}
                  >
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      Scan your Aadhar QR code or upload your Aadhar PDF to generate a zero-knowledge proof.
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowScanner(!showScanner)}
                      className={`mb-4 py-3 px-6 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } font-medium flex items-center justify-center transition-all`}
                    >
                      <QrCode size={20} className="mr-2" />
                      {showScanner ? "Hide Scanner" : "Scan Aadhar QR Code"}
                    </motion.button>

                    {showScanner && (
                      <div
                        className={`w-full max-w-sm mb-4 ${
                          isDarkMode
                            ? "bg-gray-700 p-4 rounded-lg border border-gray-600"
                            : "bg-gray-100 p-4 rounded-lg"
                        }`}
                      >
                        <QrScanner
                          delay={300}
                          onError={handleError}
                          onScan={handleScan}
                          style={{ width: "100%" }}
                          constraints={{
                            video: { facingMode: "environment" },
                          }}
                        />
                      </div>
                    )}

                    {qrData && (
                      <div
                        className={`w-full ${
                          isDarkMode ? "bg-green-900 border-green-800" : "bg-green-50 border-green-100"
                        } p-3 rounded-lg border mb-4`}
                      >
                        <p className={`${isDarkMode ? "text-green-300" : "text-green-700"} flex items-center`}>
                          <CheckCircle size={16} className="mr-2" />
                          QR code scanned successfully
                        </p>
                      </div>
                    )}

                    <div
                      className={`w-full ${
                        isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                      } border rounded-lg p-4 mb-4`}
                    >
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"} mb-3`}>
                        Generate a zero-knowledge proof with Anon Aadhaar:
                      </p>
                      <div className="flex justify-center">
                        <LogInWithAnonAadhaar fieldsToReveal={[]} nullifierSeed={1234} signal={contractAddress} />
                      </div>
                    </div>

                    <div className="w-full">
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"} mb-2`}>Status:</p>
                      <div
                        className={`p-3 rounded-lg ${
                          anonAadhaar.status === "logged-in"
                            ? isDarkMode
                              ? "bg-green-900 text-green-300 border-green-800"
                              : "bg-green-50 text-green-700 border-green-100"
                            : isDarkMode
                              ? "bg-gray-700 text-gray-300 border-gray-600"
                              : "bg-gray-50 text-gray-300 border-gray-200"
                        }`}
                      >
                        {anonAadhaar.status === "logged-in" ? (
                          <div className="flex items-center">
                            <CheckCircle size={16} className="mr-2" />
                            Aadhar verified successfully!
                          </div>
                        ) : (
                          <div>
                            {anonAadhaar.status === "logging-in" ? (
                              <div className="flex items-center">
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Verifying Aadhar...
                              </div>
                            ) : (
                              <div>
                                Anon Aadhaar Status: {anonAadhaar.status}
                                {status && <p className="mt-1 text-sm">{status}</p>}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(1)}
                      className={`py-3 px-4 rounded-lg ${
                        isDarkMode
                          ? "border border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } font-medium flex items-center justify-center`}
                    >
                      <ArrowLeft size={20} className="mr-2" />
                      Back
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(3)}
                      disabled={!isAadhaarVerified}
                      className={`flex-1 py-3 px-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
                          : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
                      } font-medium flex items-center justify-center disabled:cursor-not-allowed`}
                    >
                      Continue to Registration
                      <ChevronRight size={20} className="ml-2" />
                    </motion.button>
                  </div>
                </div>
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
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}>
                    <MapPin className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`} size={24} />
                    Complete Registration
                  </h2>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                    Finalize your registration to receive disaster relief aid
                  </p>
                </div>

                <div className="space-y-6">
                  <div
                    className={`${
                      isDarkMode ? "bg-green-900 border-green-800" : "bg-green-50 border-green-100"
                    } rounded-lg p-4 border mb-4`}
                  >
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className={`font-medium ${isDarkMode ? "text-green-300" : "text-gray-800"}`}>
                          Identity Verification Complete
                        </h3>
                        <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-700"} mt-1`}>
                          Your Aadhar has been verified using zero-knowledge proofs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${
                      isDarkMode ? "bg-green-900 border-green-800" : "bg-green-50 border-green-100"
                    } rounded-lg p-4 border mb-4`}
                  >
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className={`font-medium ${isDarkMode ? "text-green-300" : "text-gray-800"}`}>
                          Wallet Connected
                        </h3>
                        <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-700"} mt-1`}>
                          Your Coinbase Smart Wallet is ready to receive aid.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                    } rounded-lg p-6 border`}
                  >
                    <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"} mb-3`}>
                      Location Information
                    </h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                      We need your location to verify you're in the affected area. This will be captured when you
                      register.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                          Your location is only used to verify eligibility
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                          Location data is encrypted and protected
                        </span>
                      </li>
                    </ul>
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
                      <ArrowLeft size={20} className="mr-2" />
                      Back
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRegistration}
                      disabled={isRegistering}
                      className={`flex-1 py-3 px-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
                          : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
                      } font-medium flex items-center justify-center disabled:cursor-not-allowed`}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 size={20} className="mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          Register
                          <CheckCircle size={20} className="ml-2" />
                        </>
                      )}
                    </motion.button>
                  </div>

                  {status && (
                    <div
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300 border-gray-600"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      } border`}
                    >
                      {status}
                    </div>
                  )}
                </div>
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
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} hover:underline`}
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>{isInfoModalOpen && <InfoModal />}</AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>{showSuccessModal && <SuccessModal />}</AnimatePresence>
    </div>
  )
}

const VictimRegistrationPage = () => {
  return (
    <AnonAadhaarProvider>
      <VictimRegistrationContent />
    </AnonAadhaarProvider>
  )
}

export default VictimRegistrationPage
