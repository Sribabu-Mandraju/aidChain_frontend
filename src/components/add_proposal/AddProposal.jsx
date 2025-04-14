import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileText, MapPin, Image, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { getReadDaoContract, getWriteDaoContract } from '../../providers/dao_provider';
import Step1BasicInfo from './addProposal_components/Step1BasicInfo';
import Step2Location from './addProposal_components/Step2Location';
import Step3ImageUpload from './addProposal_components/Step3ImageUpload';
import Step4Review from './addProposal_components/Step4Review';
import { decodeEventLog } from 'viem';
import axios from 'axios';

const ProposalForm = () => {
  const [formData, setFormData] = useState({
    disasterName: '',
    fundsRequested: '',
    description: '',
    location: {
      latitude: '',
      longitude: '',
      radius: '',
    },
    image: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address: connectedAddress, isConnected } = useAccount();

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitProposal = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating proposal...');

    try {
      const contract = await getWriteDaoContract();
      if (!contract || !contract.publicClient || !contract.walletClient) {
        throw new Error("DAO contract or clients not available");
      }

      // Check if user is a DAO member
      const isMember = await contract.publicClient.readContract({
        ...contract,
        functionName: 'isDAOMember',
        args: [connectedAddress],
      });

      if (!isMember) {
        toast.error('Only DAO members can create proposals', { id: toastId });
        return;
      }

      // Convert funds to proper format (assuming input is in ETH, convert to wei)
      const fundsInWei = BigInt(parseFloat(formData.fundsRequested) * 1e18);

      // Prepare location data according to LocationDetails.Location struct
      const locationData = {
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        radius: formData.location.radius,
      };

      // Call createProposal function
      const hash = await contract.walletClient.writeContract({
        ...contract,
        functionName: 'createProposal',
        args: [
          formData.disasterName,
          locationData,
          fundsInWei,
          formData.image
        ],
        account: connectedAddress,
      });

      toast.loading('Waiting for transaction confirmation...', { id: toastId });

      const receipt = await contract.publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        try {
          // Find the ProposalCreated event log
          const eventAbi = {
            name: 'ProposalCreated',
            type: 'event',
            inputs: [
              { name: 'proposalId', type: 'uint256', indexed: true },
              { name: 'disasterName', type: 'string', indexed: false },
              {
                name: 'location',
                type: 'tuple',
                indexed: false,
                components: [
                  { name: 'latitude', type: 'string' },
                  { name: 'longitude', type: 'string' },
                  { name: 'radius', type: 'string' }
                ]
              },
              { name: 'fundAmount', type: 'uint256', indexed: false }
            ]
          };

          let proposalId;
          let decodedEvent;

          // Iterate through logs to find the ProposalCreated event
          for (const log of receipt.logs) {
            try {
              const decoded = decodeEventLog({
                abi: [eventAbi],
                data: log.data,
                topics: log.topics,
              });

              if (decoded.eventName === 'ProposalCreated') {
                decodedEvent = decoded;
                proposalId = decoded.args.proposalId.toString();
                break;
              }
            } catch (decodeError) {
              console.warn("Failed to decode log:", decodeError);
              continue;
            }
          }

          if (!proposalId || !decodedEvent) {
            throw new Error("Could not find or decode ProposalCreated event");
          }

          console.log("=== Decoded Proposal Event Data ===");
          console.log("Proposal ID:", proposalId);
          console.log("Disaster Name:", decodedEvent.args.disasterName);
          console.log("Location:", {
            latitude: decodedEvent.args.location.latitude,
            longitude: decodedEvent.args.location.longitude,
            radius: decodedEvent.args.location.radius
          });
          console.log("Fund Amount (wei):", decodedEvent.args.fundAmount.toString());
          console.log("Fund Amount (ETH):", 
            parseFloat(decodedEvent.args.fundAmount.toString()) / 1e18
          );
          console.log("================================");

          // Make API call to store proposalId and description
          try {
            const apiResponse = await axios.post(`${"https://aidchain-backend.onrender.com"}/api/proposals`, {
              proposalId: proposalId,
              description: formData.description
            });

            if (apiResponse.status === 200 || apiResponse.status === 201) {
              toast.success(
                <div>
                  <p>Proposal created successfully!</p>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`https://sepolia.basescan.org/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      View Transaction
                    </a>
                    <span>•</span>
                    <span className="text-sm">Proposal ID: {proposalId}</span>
                  </div>
                </div>,
                { id: toastId, duration: 5000 }
              );
            } else {
              throw new Error(`API responded with status ${apiResponse.status}`);
            }
          } catch (apiError) {
            console.error("API Error:", apiError);
            toast.error("Failed to save proposal metadata", { id: toastId });
          }

        } catch (eventError) {
          console.error("Error processing event logs:", eventError);
          console.error("Receipt logs:", receipt.logs);
          toast.error("Failed to process proposal event", { id: toastId });
        }

        // Reset form
        setFormData({
          disasterName: '',
          fundsRequested: '',
          description: '',
          location: {
            latitude: '',
            longitude: '',
            radius: '',
          },
          image: '',
        });
        setCurrentStep(1);
      } else {
        toast.error('Transaction failed', { id: toastId });
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      const errorMessage = error?.shortMessage || error?.message || 'An unknown error occurred';
      toast.error(`Failed to create proposal: ${errorMessage}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { name: 'Basic Info', icon: <FileText size={20} /> },
    { name: 'Location', icon: <MapPin size={20} /> },
    { name: 'Image', icon: <Image size={20} /> },
    { name: 'Review', icon: <CheckCircle size={20} /> },
  ];

  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      nextStep,
      previousStep,
      currentStep,
      isSubmitting,
      handleSubmitProposal,
    };

    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...stepProps} />;
      case 2:
        return <Step2Location {...stepProps} />;
      case 3:
        return <Step3ImageUpload {...stepProps} />;
      case 4:
        return <Step4Review {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
          },
        }}
      />

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
              Create a Disaster Relief Proposal
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Submit a detailed proposal to initiate disaster relief efforts. Complete all steps to ensure a thorough evaluation.
            </p>
          </motion.div>
        </header>

        <main className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex justify-between items-center max-w-3xl mx-auto">
                {steps.map((step, index) => (
                  <div key={index} className="flex-1 text-center">
                    <motion.div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2 ${
                        currentStep >= index + 1
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                      animate={{
                        scale: currentStep === index + 1 ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.div>
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= index + 1 ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </p>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 mx-auto mt-2 ${
                          currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ width: '80%' }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        <footer className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Mail size={16} />
              Need assistance?{' '}
              <a
                href="mailto:support@example.com"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
                aria-label="Contact support"
              >
                Contact our support team
              </a>
            </p>
            <p className="mt-4 text-xs text-gray-400">
              © 2025 Disaster Relief Proposals. All rights reserved.
            </p>
          </motion.div>
        </footer>
      </div>
    </div>
  );
};

export default ProposalForm;