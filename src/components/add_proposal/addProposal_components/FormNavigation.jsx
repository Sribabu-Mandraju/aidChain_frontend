import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FormNavigation = ({
  onPrevious,
  onNext,
  showPrevious = true,
  nextLabel = 'Next',
  currentStep,
}) => {
  const steps = ['Basic Info', 'Location', 'Image', 'Review'];

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`text-sm font-medium transition-colors duration-300 ${
                currentStep >= index + 1 ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {showPrevious && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
              type="button"
            >
              <ChevronLeft size={16} />
              Previous
            </motion.button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-5 py-2.5 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
          type="button"
        >
          {nextLabel}
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default FormNavigation;