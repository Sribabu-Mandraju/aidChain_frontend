// ProposalForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, FileText, MapPin, Image, CheckCircle } from 'lucide-react';
import Step1BasicInfo from './addProposal_components/Step1BasicInfo';
import Step2Location from './addProposal_components/Step2Location';
import Step3ImageUpload from './addProposal_components/Step3ImageUpload';
import Step4Review from './addProposal_components/Step4Review';

const ProposalForm = () => {
  const [formData, setFormData] = useState({
    disasterName: '',
    fundsRequested: '',
    description: '', // Added description field
    location: {
      latitude: '',
      longitude: '',
      radius: '',
    },
    image: '',
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

  console.log(currentStep);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
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

        {/* Form Card */}
        <main className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Progress Bar */}
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

            {/* Form Content */}
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

        {/* Footer */}
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