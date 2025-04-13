import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Gift } from "lucide-react";

const DonationSection = ({ campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationType, setDonationType] = useState("campaign"); // "campaign" or "organization"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDonate = () => {
    setError("");
    setSuccess("");

    // Validate donation amount
    if (!donationAmount || donationAmount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    // Validate campaign selection if donating to a campaign
    if (donationType === "campaign" && !selectedCampaign) {
      setError("Please select a campaign to donate to.");
      return;
    }

    // Simulate donation processing
    try {
      const donationDetails = {
        type: donationType,
        campaignId: donationType === "campaign" ? selectedCampaign : null,
        campaignTitle:
          donationType === "campaign"
            ? campaigns.find((c) => c.id === parseInt(selectedCampaign))?.title
            : "Organization",
        amount: donationAmount,
      };

      // Log donation details (placeholder for future contract integration)
      console.log("Donation submitted:", donationDetails);

      // Set success message
      setSuccess(
        `Thank you for your ${donationAmount} ETH donation to ${donationDetails.campaignTitle}! Your support makes a difference.`
      );

      // Reset form
      setDonationAmount("");
      setSelectedCampaign("");
    } catch (err) {
      setError("Donation processing failed. Please try again.");
      console.error("Donation error:", err);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-12 shadow-lg"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            Make a Difference Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Choose to support a specific campaign or donate to our organization
            to fund ongoing relief efforts.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDonationType("campaign")}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                donationType === "campaign"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50"
              }`}
            >
              Donate to a Campaign
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDonationType("organization")}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                donationType === "organization"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50"
              }`}
            >
              Donate to Organization
            </motion.button>
          </div>

          <div className="max-w-lg mx-auto space-y-6">
            {donationType === "campaign" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Campaign
                </label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (ETH)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-500" />
                </div>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="e.g., 0.01"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm flex items-center gap-1">
                <Gift size={16} />
                {success}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDonate}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transition-all"
            >
              Donate Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DonationSection;
