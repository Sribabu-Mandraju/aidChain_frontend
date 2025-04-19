import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AnonAadhaarProvider,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "@anon-aadhaar/react";
import QrScanner from "react-qr-scanner";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  QrCode,
  X,
  Info,
  FileText,
  Wallet,
} from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const VERIFICATION_TIMEOUT = 60000; // 1 minute timeout
const PROGRESS_UPDATE_INTERVAL = 300; // Update progress every 300ms
const INITIAL_PROGRESS = 30; // Start at 30% to account for initial setup

const EnhancedVerification = ({ onVerificationComplete }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState("");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [nullifier, setNullifier] = useState("");
  const [anonAadhaar] = useAnonAadhaar();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [verificationStartTime, setVerificationStartTime] = useState(null);
  const contractAddress = "0x6B93a13b8D08Cd5893141DF090e2e53A1B7c08d9";

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: injected(),
  });
  const { disconnect } = useDisconnect();
//
  // Handle wallet connection
  const handleWalletConnect = async () => {
    try {
      await connect();
      setIsWalletConnected(true);
      setStatus("Wallet connected successfully!");
      console.log("Wallet connected:", address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus("Error connecting wallet. Please try again.");
    }
  };

  // Handle QR code scanning
  const handleScan = useCallback((data) => {
    if (data && data.text) {
      setQrData(data.text);
      setShowScanner(false);
      setStatus("QR code scanned. Starting verification process...");
      setIsProcessing(true);
      setVerificationProgress(INITIAL_PROGRESS);
      setVerificationStartTime(Date.now());
    }
  }, []);

  const handleError = useCallback((err) => {
    console.error(err);
    setStatus("Error scanning QR code. Try uploading a file instead.");
    setIsProcessing(false);
    setVerificationProgress(0);
    setVerificationStartTime(null);
  }, []);

  // Monitor Anon Aadhaar status and handle timeouts
  useEffect(() => {
    let progressInterval;
    let timeoutId;

    if (isProcessing && verificationStartTime) {
      // Set timeout for verification
      timeoutId = setTimeout(() => {
        if (anonAadhaar.status !== "logged-in") {
          setStatus("Verification timed out. Please try again.");
          setIsProcessing(false);
          setVerificationProgress(0);
          setVerificationStartTime(null);
        }
      }, VERIFICATION_TIMEOUT);

      // Update progress more frequently
      progressInterval = setInterval(() => {
        setVerificationProgress(prev => {
          if (prev >= 90) return prev;
          const elapsedTime = Date.now() - verificationStartTime;
          const newProgress = Math.min(90, INITIAL_PROGRESS + (elapsedTime / VERIFICATION_TIMEOUT) * 60);
          return Math.floor(newProgress);
        });
      }, PROGRESS_UPDATE_INTERVAL);
    }

    if (anonAadhaar.status === "logged-in" && anonAadhaar.anonAadhaarProof) {
      try {
        // Safely access the nullifier
        const proofNullifier = anonAadhaar.anonAadhaarProof.nullifier;
        if (proofNullifier) {
          setNullifier(proofNullifier);
          setStatus("Anon Aadhaar proof generated successfully!");
          setVerificationProgress(100);
          setIsProcessing(false);
          setVerificationStartTime(null);
          
          // Log verification details
          console.log("Verification Successful:", {
            nullifier: proofNullifier,
            walletAddress: address,
            timestamp: new Date().toISOString()
          });
          
          // Notify parent component of successful verification
          onVerificationComplete({
            anonAadhaarProof: anonAadhaar.anonAadhaarProof,
            walletAddress: address,
          });
        } else {
          throw new Error("Nullifier not found in proof");
        }
      } catch (error) {
        console.error("Error accessing nullifier:", error);
        setStatus("Error accessing nullifier. Please try again.");
        setIsProcessing(false);
        setVerificationProgress(0);
        setVerificationStartTime(null);
      }
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [anonAadhaar.status, anonAadhaar.anonAadhaarProof, address, isProcessing, verificationStartTime, onVerificationComplete]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Shield className="mr-2 text-indigo-600" size={24} />
            Identity Verification
          </h2>
          <p className="text-gray-600 mt-1">
            Verify your wallet and Aadhaar identity using zero-knowledge proof
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Wallet Connection Step */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
            <Wallet className="mr-2 text-indigo-600" size={20} />
            Step 1: Connect Your Wallet
          </h3>
          <p className="text-gray-700 mb-4">
            Connect your wallet to begin the verification process.
          </p>
          <div className="flex flex-col items-center">
            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWalletConnect}
                className="py-3 px-6 rounded-lg bg-indigo-600 text-white font-medium flex items-center justify-center hover:bg-indigo-700 transition-all"
              >
                <Wallet size={20} className="mr-2" />
                Connect Wallet
              </motion.button>
            ) : (
              <div className="w-full bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-green-700 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Aadhaar Verification Step - Only show after wallet is connected */}
        {isConnected && (
          <>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                <Shield className="mr-2 text-indigo-600" size={20} />
                Step 2: Aadhaar Verification
              </h3>
              <p className="text-gray-700">
                Scan your Aadhaar QR code or upload your Aadhaar PDF to generate a zero-knowledge proof.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowScanner(!showScanner)}
                className="mb-4 py-3 px-6 rounded-lg bg-indigo-100 text-indigo-700 font-medium flex items-center justify-center hover:bg-indigo-200 transition-all"
                disabled={isProcessing}
              >
                <QrCode size={20} className="mr-2" />
                {showScanner ? "Hide Scanner" : "Scan Aadhaar QR Code"}
              </motion.button>

              {showScanner && (
                <div className="w-full max-w-sm mb-4 bg-gray-100 p-4 rounded-lg">
                  <QrScanner
                    delay={30}
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
                <div className="w-full bg-green-50 p-3 rounded-lg border border-green-100 mb-4">
                  <p className="text-green-700 flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    QR code scanned successfully
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="w-full mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                    <span className="text-sm font-medium text-gray-700">{verificationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${verificationProgress}%` }}
                    ></div>
                  </div>
                  {verificationProgress < 100 && (
                    <p className="text-sm text-gray-500 mt-2">
                      This process may take up to 1 minute. Please wait...
                    </p>
                  )}
                </div>
              )}

              <div className="w-full bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-3">
                  Generate a zero-knowledge proof with Anon Aadhaar:
                </p>
                <div className="flex justify-center">
                  <LogInWithAnonAadhaar
                    fieldsToReveal={[]}
                    nullifierSeed={1234}
                    signal={contractAddress}
                  />
                </div>
              </div>

              <div className="w-full">
                <p className="text-sm text-gray-500 mb-2">Status:</p>
                <div
                  className={`p-3 rounded-lg ${
                    anonAadhaar.status === "logged-in"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  {anonAadhaar.status === "logged-in" ? (
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      Aadhaar verified successfully!
                    </div>
                  ) : (
                    <div>
                      {anonAadhaar.status === "logging-in" ? (
                        <div className="flex items-center">
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Verifying Aadhaar... This may take a few moments
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
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedVerification; 