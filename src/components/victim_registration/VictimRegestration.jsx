    

    import React, { useState, useEffect } from "react"
    import { motion, AnimatePresence } from "framer-motion"
    import { AnonAadhaarProvider, LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react"
    import QrScanner from "react-qr-scanner"
    import { Shield, Wallet, CheckCircle, ChevronRight, AlertCircle, ArrowLeft, Loader2, QrCode, X, Info, RefreshCw } from 'lucide-react'

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
    const contractAddress = "0x6B93a13b8D08Cd5893141DF090e2e53A1B7c08d9" // Replace with your actual contract address

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
            
            // Move to next step after successful verification
            if (currentStep === 1) {
            setTimeout(() => setCurrentStep(2), 1000)
            }
        } catch (error) {
            console.error("Error accessing nullifier:", error)
            setStatus("Error accessing nullifier. Please try again.")
        }
        }
    }, [anonAadhaar.status, currentStep])

    // Connect to Coinbase Smart Wallet
    const handleWalletConnection = async () => {
        setIsConnectingWallet(true)
        setStatus("Connecting to Coinbase Smart Wallet...")

        try {
        const walletData = await connectCoinbaseWallet()
        setWalletAddress(walletData.address)
        setStatus("Wallet connected successfully!")
        
        // Log the wallet address and nullifier to console
        console.log("Registration Data:", {
            nullifier: nullifier,
            walletAddress: walletData.address,
        })
        
        setCurrentStep(3)
        } catch (error) {
        console.error("Wallet connection error:", error)
        setStatus("Failed to connect wallet. Please try again.")
        } finally {
        setIsConnectingWallet(false)
        }
    }

    // Reset the form to start over
    const handleReset = () => {
        setCurrentStep(1)
        setQrData("")
        setStatus("")
        setWalletAddress("")
        setNullifier("")
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
            <h3 className="text-xl font-bold text-gray-900">About ZK Aadhar Verification</h3>
            <button onClick={() => setIsInfoModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
            </button>
            </div>
            <div className="space-y-4 text-gray-600">
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
            <p className="font-medium text-gray-700 mt-4">
                Your privacy and security are our top priorities. No sensitive data is stored on the blockchain.
            </p>
            </div>
        </motion.div>
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Disaster Relief Registration</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
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
                        currentStep >= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                    >
                    {currentStep > step ? <CheckCircle size={20} /> : step}
                    </div>
                    <div className="text-xs mt-2 text-gray-500">
                    {step === 1 && "Verify Aadhar"}
                    {step === 2 && "Connect Wallet"}
                    {step === 3 && "Confirmation"}
                    </div>
                </div>
                ))}
            </div>
            <div className="relative max-w-xl mx-auto mt-2">
                <div className="absolute top-0 left-[10%] right-[10%] h-1 bg-gray-200"></div>
                <div
                className="absolute top-0 left-[10%] h-1 bg-indigo-600 transition-all duration-500"
                style={{ width: `${(currentStep - 1) * 50}%` }}
                ></div>
            </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait">
                {/* Step 1: Aadhar Verification */}
                {currentStep === 1 && (
                <motion.div
                    key="step1"
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
                        <p className="text-gray-600 mt-1">Verify your identity using Aadhar with zero-knowledge proof</p>
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
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                        <p className="text-gray-700">
                        Scan your Aadhar QR code or upload your Aadhar PDF to generate a zero-knowledge proof.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowScanner(!showScanner)}
                        className="mb-4 py-3 px-6 rounded-lg bg-indigo-100 text-indigo-700 font-medium flex items-center justify-center hover:bg-indigo-200 transition-all"
                        >
                        <QrCode size={20} className="mr-2" />
                        {showScanner ? "Hide Scanner" : "Scan Aadhar QR Code"}
                        </motion.button>

                        {showScanner && (
                        <div className="w-full max-w-sm mb-4 bg-gray-100 p-4 rounded-lg">
                            <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: "100%" }}
                            constraints={{
                                video: { facingMode: "environment" }
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
                    </div>
                </motion.div>
                )}

                {/* Step 2: Connect Wallet */}
                {currentStep === 2 && (
                <motion.div
                    key="step2"
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
                    <p className="text-gray-600 mt-1">Connect your Coinbase Smart Wallet to receive aid</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
                    <div className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                        <h3 className="font-medium text-gray-800">Aadhar Successfully Verified</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Your identity has been verified using zero-knowledge proofs.
                        </p>
                        <div className="mt-2 bg-white p-3 rounded border border-gray-200 break-all">
                            <p className="text-xs text-gray-500 mb-1">Nullifier (Private ID):</p>
                            <p className="text-sm font-mono text-gray-700">{nullifier}</p>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="font-medium text-gray-800 mb-3">Why Connect a Wallet?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Receive aid directly to your wallet</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>No intermediaries or delays</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Secure and transparent distribution</span>
                        </li>
                        </ul>
                    </div>

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

                        <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWalletConnection}
                        disabled={isConnectingWallet}
                        className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium flex items-center justify-center disabled:opacity-70"
                        >
                        {isConnectingWallet ? (
                            <>
                            <Loader2 size={20} className="mr-2 animate-spin" />
                            Connecting...
                            </>
                        ) : (
                            <>
                            Connect Coinbase Wallet
                            <ChevronRight size={20} className="ml-2" />
                            </>
                        )}
                        </motion.button>
                    </div>

                    {status && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
                        {status}
                        </div>
                    )}
                    </div>
                </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                <motion.div
                    key="step3"
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
                    <h2 className="text-2xl font-bold text-gray-800">Registration Successful!</h2>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto">
                        Your registration has been completed successfully. You will receive aid directly to your wallet once
                        approved.
                    </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8 max-w-md mx-auto">
                    <h3 className="font-medium text-gray-800 mb-4 text-left">Registration Summary</h3>
                    <div className="space-y-3 text-left">
                        <div>
                        <p className="text-xs text-gray-500">Wallet Address:</p>
                        <p className="text-sm font-mono text-gray-700 break-all">{walletAddress}</p>
                        </div>
                        <div>
                        <p className="text-xs text-gray-500">Nullifier:</p>
                        <p className="text-sm font-mono text-gray-700 break-all">{nullifier}</p>
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

                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="#"
                        className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium flex items-center justify-center"
                    >
                        View Status
                        <ChevronRight size={20} className="ml-2" />
                    </motion.a>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
            <p>
                Need help? Contact our support team at{" "}
                <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">
                support@example.com
                </a>
            </p>
            </div>
        </div>

        {/* Info Modal */}
        <AnimatePresence>{isInfoModalOpen && <InfoModal />}</AnimatePresence>
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

