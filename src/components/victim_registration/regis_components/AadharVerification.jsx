"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AnonAadhaarProvider,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { getCoordinatesFromPincode } from '../../../utils/geocoding'

function AadharVerificationContent({
  isDarkMode,
  setCurrentStep,
  setIsAadhaarVerified,
  isAadhaarVerified,
  setNullifier,
  status,
  setStatus,
  setIsInfoModalOpen,
  contractAddress,
  onVerificationComplete,
}) {
  const [anonAadhaar] = useAnonAadhaar()
  const [, latestProof] = useProver()
  const [verificationStatus, setVerificationStatus] = useState('idle')
  const [error, setError] = useState(null)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: injected(),
    onError: (error) => {
      console.error('Wallet connection error:', error)
      setStatus('Wallet connection failed. Please try again.')
    }
  })
  const { disconnect } = useDisconnect()

  useEffect(() => {
    const existingProof = localStorage.getItem('anon-aadhaar-proof')
    if (existingProof) {
      try {
        const proof = JSON.parse(existingProof)
        if (proof?.nullifier && isConnected) {
          setNullifier(proof.nullifier)
          setIsAadhaarVerified(true)
          setVerificationStatus('success')
          setCurrentStep(2)
        } else {
          localStorage.removeItem('anon-aadhaar-proof')
        }
      } catch (error) {
        console.error('Error loading existing proof:', error)
        localStorage.removeItem('anon-aadhaar-proof')
      }
    }
  }, [setNullifier, setIsAadhaarVerified, isConnected, setCurrentStep])

  useEffect(() => {
    const handleVerification = async () => {
      try {
        if (!isConnected) {
          setStatus('Please connect your wallet first')
          setVerificationStatus('idle')
          setCurrentStep(1)
          return
        }

        if (anonAadhaar?.status === 'logged-in') {
          const proof = anonAadhaar.anonAadhaarProof || (anonAadhaar.anonAadhaarProofs && anonAadhaar.anonAadhaarProofs[0])

          if (proof) {
            try {
              let pcdData = null
              if (proof.pcd) {
                try {
                  pcdData = JSON.parse(proof.pcd)
                  console.log('Parsed PCD:', pcdData)

                  // Extract state and pincode from the proof
                  const state = pcdData?.proof?.revealedFields?.state || 
                               pcdData?.proof?.state || 
                               pcdData?.claim?.state;
                               
                  const pincode = pcdData?.proof?.revealedFields?.pincode || 
                                 pcdData?.proof?.pincode || 
                                 pcdData?.claim?.pincode;

                  console.log('Extracted location details:', { state, pincode });

                  if (state && pincode) {
                    try {
                      // Get coordinates from pincode and state
                      const coordinates = await getCoordinatesFromPincode(pincode, state);
                      console.log('Retrieved coordinates:', coordinates);

                      // Store location details in localStorage
                      localStorage.setItem('victim-location', JSON.stringify({
                        state,
                        pincode,
                        coordinates,
                        source: 'aadhaar'
                      }));
                    } catch (error) {
                      console.error('Error getting coordinates:', error);
                      // Still store the pincode and state even if coordinates fetch fails
                      localStorage.setItem('victim-location', JSON.stringify({
                        state,
                        pincode,
                        source: 'aadhaar'
                      }));
                    }
                  }
                } catch (e) {
                  console.error('Error parsing PCD:', e)
                }
              }

              const nullifier = pcdData?.proof?.nullifier || proof.nullifier
              if (nullifier) {
                setNullifier(nullifier)
                setVerificationStatus('success')
                setError(null)
                setIsAadhaarVerified(true)
                setStatus('Verification successful!')

                const proofToStore = {
                  ...proof,
                  nullifier: nullifier,
                  location: {
                    state: pcdData?.proof?.revealedFields?.state || 
                           pcdData?.proof?.state || 
                           pcdData?.claim?.state,
                    pincode: pcdData?.proof?.revealedFields?.pincode || 
                            pcdData?.proof?.pincode || 
                            pcdData?.claim?.pincode
                  }
                }
                localStorage.setItem('anon-aadhaar-proof', JSON.stringify(proofToStore))

                if (onVerificationComplete) {
                  onVerificationComplete({
                    anonAadhaarProof: proofToStore,
                    walletAddress: address,
                    location: proofToStore.location
                  })
                }
              } else {
                console.error('No nullifier found in proof')
                setError('Verification failed: No nullifier found')
                setVerificationStatus('error')
                setIsAadhaarVerified(false)
              }
            } catch (error) {
              console.error('Error processing proof:', error)
              setError('Error processing proof. Please try again.')
              setVerificationStatus('error')
              setIsAadhaarVerified(false)
            }
          } else {
            console.error('No proof found in logged-in state')
            setError('Verification failed: No proof found')
            setVerificationStatus('error')
            setIsAadhaarVerified(false)
          }
        } else if (anonAadhaar?.status === 'error') {
          console.error('Verification error:', anonAadhaar.error)
          setVerificationStatus('error')
          setError(anonAadhaar.error || 'Verification failed. Please try again.')
          setStatus(anonAadhaar.error || 'Verification failed. Please try again.')
          setIsAadhaarVerified(false)
        } else if (anonAadhaar?.status === 'logging-in') {
          setVerificationStatus('processing')
          setError(null)
          setStatus('Generating proof...')
          setIsAadhaarVerified(false)
        } else if (anonAadhaar?.status === 'logged-out') {
          setVerificationStatus('idle')
          setError(null)
          setStatus('Please complete Aadhaar verification')
          setIsAadhaarVerified(false)
        }
      } catch (error) {
        console.error('Error during verification:', error)
        setError('Verification failed. Please try again.')
        setStatus('Verification failed. Please try again.')
        setIsAadhaarVerified(false)
      }
    }

    handleVerification()
  }, [anonAadhaar, setIsAadhaarVerified, setNullifier, setStatus, onVerificationComplete, address, isConnected, setCurrentStep])

  const handleWalletConnect = async () => {
    try {
      await connect()
      setStatus('Wallet connected. Please complete Aadhaar verification.')
      setCurrentStep(2)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setStatus('Error connecting wallet. Please try again.')
    }
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Aadhaar Verification</h2>

        {!isConnected ? (
          <div className="flex justify-center">
            <button 
              onClick={handleWalletConnect} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <LogInWithAnonAadhaar
                fieldsToReveal={["revealPinCode", "revealState"]}
                nullifierSeed={1234}
                signal={1234}
                _useTestAadhaar={true}
                className="w-full bg-gray-800 text-white py-3 px-8 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-300"
              />
            </div>

            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <div className="text-green-600 flex items-center justify-center">
                  <CheckCircle className="mr-2" /> Aadhaar Verified Successfully
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    Proceed to Registration
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
                  </button>
                </div>
              </div>
            )}

            {verificationStatus === 'processing' && (
              <div className="text-yellow-600 flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" /> Verifying...
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="text-red-600 flex items-center justify-center">
                <AlertCircle className="mr-2" /> {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AadharVerification(props) {
  return (
    <AnonAadhaarProvider>
      <AadharVerificationContent {...props} />
    </AnonAadhaarProvider>
  )
}