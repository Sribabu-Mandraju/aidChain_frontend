"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react"
import QrScanner from "react-qr-scanner"

const AadharVerification = ({
  isDarkMode,
  setCurrentStep,
  setIsAadhaarVerified,
  isAadhaarVerified,
  setNullifier,
  status,
  setStatus,
  setIsInfoModalOpen,
  contractAddress,
}) => {
  const [showScanner, setShowScanner] = useState(false)
  const [qrData, setQrData] = useState("")
  const [anonAadhaar] = useAnonAadhaar()

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
  }, [anonAadhaar.status, setIsAadhaarVerified, setNullifier, setStatus])

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
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
              isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } font-medium flex items-center justify-center transition-all`}
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <rect x="7" y="7" width="3" height="9"></rect>
              <rect x="14" y="7" width="3" height="5"></rect>
            </svg>
            {showScanner ? "Hide Scanner" : "Scan Aadhar QR Code"}
          </motion.button>

          {showScanner && (
            <div
              className={`w-full max-w-sm mb-4 ${
                isDarkMode ? "bg-gray-700 p-4 rounded-lg border border-gray-600" : "bg-gray-100 p-4 rounded-lg"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
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
                    : "bg-gray-50 text-gray-700 border-gray-200"
              } border`}
            >
              {anonAadhaar.status === "logged-in" ? (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Aadhar verified successfully!
                </div>
              ) : (
                <div>
                  {anonAadhaar.status === "logging-in" ? (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
            onClick={() => setCurrentStep(3)}
            disabled={!isAadhaarVerified}
            className={`flex-1 py-3 px-4 rounded-lg ${
              isDarkMode
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
                : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
            } font-medium flex items-center justify-center disabled:cursor-not-allowed`}
          >
            Continue to Registration
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default AadharVerification
