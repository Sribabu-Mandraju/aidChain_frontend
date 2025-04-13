import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NewProposalModal = ({ onClose, onCreateProposal }) => {
  const [formData, setFormData] = useState({
    disasterName: "",
    area: "",
    duration: 30,
    fundsRequested: 100000,
    image:
      "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "fundsRequested"
          ? Number(value)
          : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.disasterName.trim()) {
      newErrors.disasterName = "Disaster name is required";
    }

    if (!formData.area.trim()) {
      newErrors.area = "Area is required";
    }

    if (formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 day";
    }

    if (formData.fundsRequested < 1) {
      newErrors.fundsRequested = "Funds requested must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onCreateProposal(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-4 px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Create New Proposal
                </h3>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="disasterName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Disaster Name
                  </label>
                  <input
                    type="text"
                    id="disasterName"
                    name="disasterName"
                    value={formData.disasterName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.disasterName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Hurricane Relief Fund"
                  />
                  {errors.disasterName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.disasterName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Affected Area
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.area ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Caribbean Islands"
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.duration ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fundsRequested"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Funds Requested (USD)
                  </label>
                  <input
                    type="number"
                    id="fundsRequested"
                    name="fundsRequested"
                    value={formData.fundsRequested}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fundsRequested
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.fundsRequested && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fundsRequested}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave default for a placeholder image
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewProposalModal;
