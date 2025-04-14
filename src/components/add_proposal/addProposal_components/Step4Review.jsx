// Step4Review.jsx
import React from 'react';
import { motion } from 'framer-motion';
import FormNavigation from './FormNavigation';
import { Check, MapPin, DollarSign, ImageIcon, AlertTriangle, FileText } from 'lucide-react';

const Step4Review = ({ formData, previousStep, handleSubmitProposal, isSubmitting }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const isComplete =
    formData.disasterName &&
    formData.fundsRequested &&
    formData.description && // Added description
    formData.location?.latitude &&
    formData.location?.longitude &&
    formData.location?.radius &&
    formData.image;

  return (
    <motion.div
      className="bg-white rounded-xl p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-gray-800">Review & Submit</h2>

        {isComplete ? (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Check size={16} className="mr-1" />
            <span className="text-sm font-medium">Ready to submit</span>
          </div>
        ) : (
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            <AlertTriangle size={16} className="mr-1" />
            <span className="text-sm font-medium">Missing information</span>
          </div>
        )}
      </motion.div>

      <div className="space-y-6">
        <motion.div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm" variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Disaster Name</h3>
              <p className="text-lg font-medium text-gray-800">{formData.disasterName || 'Not specified'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                <DollarSign size={16} className="mr-1" />
                Funds Requested
              </h3>
              <p className="text-lg font-medium text-gray-800">
                {formData.fundsRequested ? `$${Number(formData.fundsRequested).toLocaleString()}` : 'Not specified'}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                <FileText size={16} className="mr-1" />
                Description
              </h3>
              <p className="text-base text-gray-800">{formData.description || 'Not specified'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
              <MapPin size={16} className="mr-1" />
              Location
            </h3>
            {formData.location?.latitude && formData.location?.longitude ? (
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <p className="text-base text-gray-800">
                  Latitude: {formData.location.latitude}, Longitude: {formData.location.longitude}
                </p>
                <p className="text-sm text-gray-600 mt-1">Radius: {formData.location.radius} km</p>
              </div>
            ) : (
              <p className="text-base text-gray-800">Location not specified</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <ImageIcon size={16} className="mr-1" />
            Campaign Image
          </h3>
          {formData.image ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md">
              <img src={formData.image} alt="Campaign" className="w-full h-48 object-cover" />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-8 text-center border border-gray-200">
              <p className="text-gray-500">No image uploaded</p>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-800 text-sm"
        >
          <p className="flex items-center">
            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
            Please review all information carefully before submitting. Once submitted, you may need to contact support
            to make changes.
          </p>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={previousStep}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmitProposal}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
              Submitting...
            </>
          ) : (
            'Submit Proposal'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Step4Review;