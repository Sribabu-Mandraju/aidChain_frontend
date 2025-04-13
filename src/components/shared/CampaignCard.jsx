import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Gift,
  Share2,
  Link,
  X,
  MessageCircle,
  Twitter,
  Facebook,
  MapPin,
  Users,
} from "lucide-react";
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
} from "react-share";
import CampaignMap from "./campaignCard_components/CampaignMap";
const CampaignCard = ({ campaign, index }) => {
  const [hovered, setHovered] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Share URL (adjust based on your domain)
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/${campaign.id}`
      : "";
  const shareTitle = `Support ${campaign.title} - Help make a difference!`;

  // Handle Details redirect
  const handleDetails = () => {
    window.location.href = `/campaigns/${campaign.id}`;
  };

  // Handle Donation submission
  const handleDonate = () => {
    setError("");
    setSuccess("");

    if (!donationAmount || donationAmount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    try {
      const donationDetails = {
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        amount: donationAmount,
      };

      console.log("Donation submitted:", donationDetails);

      setSuccess(
        `Thank you for your ${donationAmount} ETH donation to ${campaign.title}! Your support makes a difference.`
      );
      setDonationAmount("");
      setTimeout(() => {
        setIsDonateModalOpen(false);
        setSuccess("");
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError("Donation processing failed. Please try again.");
      console.error("Donation error:", err);
    }
  };

  // Handle Registration submission
  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!registerData.name || !registerData.email) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Registration submitted:", registerData);

      setSuccess(
        `Thank you for registering for ${campaign.title}! We'll be in touch soon.`
      );
      setRegisterData({ name: "", email: "", phone: "" });
      setTimeout(() => {
        setIsRegisterModalOpen(false);
        setSuccess("");
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Donation Modal
  const DonationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsDonateModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Donate to {campaign.title}
          </h3>
          <button
            onClick={() => setIsDonateModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Your donation will help {campaign.title.toLowerCase()}. Every
          contribution counts!
        </p>
        <div className="space-y-4">
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
    </motion.div>
  );

  // Share Modal
  const ShareModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsShareModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Share {campaign.title}
          </h3>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Spread the word about this campaign to help reach more supporters!
        </p>
        <div className="grid grid-cols-2 gap-4">
          <WhatsappShareButton
            url={shareUrl}
            title={shareTitle}
            className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <MessageCircle size={20} className="mr-2" />
            WhatsApp
          </WhatsappShareButton>
          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Twitter size={20} className="mr-2" />
            Twitter
          </TwitterShareButton>
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Facebook size={20} className="mr-2" />
            Facebook
          </FacebookShareButton>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Link size={20} className="mr-2" />
            Copy Link
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Map Modal
  const MapModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsMapModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full h-[80vh] max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {campaign.title} - Location
          </h3>
          <button
            onClick={() => setIsMapModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="h-[calc(100%-60px)]">
          <CampaignMap
            latitude={campaign.latitude}
            longitude={campaign.longitude}
            radius={campaign.radius}
            title={campaign.title}
          />
        </div>
      </motion.div>
    </motion.div>
  );

  // Register Modal
  const RegisterModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsRegisterModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Register for {campaign.title}
          </h3>
          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Join this campaign and be part of the solution!
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={registerData.phone}
              onChange={(e) =>
                setRegisterData({ ...registerData, phone: e.target.value })
              }
              placeholder="+1 (123) 456-7890"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
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
              <Users size={16} />
              {success}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transition-all"
          >
            Register Now
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Card Image */}
        <div className="relative h- overflow-hidden  md:w-2/5 md:min-h-[250px]">
          <img
            src={campaign.image || "/placeholder.svg?height=400&width=600"}
            alt={campaign.title}
            className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-4 md:hidden">
            <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
          </div>
          <span
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              campaign.status === "Urgent"
                ? "bg-red-500 text-white"
                : campaign.status === "Active"
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {campaign.status}
          </span>

          {/* Map Pin Button */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="absolute bottom-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 group-hover:scale-110"
            aria-label="View on map"
          >
            <MapPin size={20} className="text-green-600" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col justify-between md:w-3/5">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 hidden md:block">
              {campaign.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {truncateDescription(campaign.description)}
              <button
                onClick={handleDetails}
                className="ml-1 text-green-600 hover:text-green-700 font-medium"
              >
                Know more
              </button>
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-green-600">
                  {campaign.totalDonations}
                </span>
                <span className="text-gray-500">of {campaign.goal}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transform origin-left transition-transform duration-500"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-green-600 font-semibold">
                  {campaign.donors}
                </div>
                <div className="text-xs text-gray-500">Donors</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-green-600 font-semibold">
                  {campaign.daysLeft > 0 ? `${campaign.daysLeft}` : "0"}
                </div>
                <div className="text-xs text-gray-500">
                  {campaign.daysLeft > 0 ? "Days Left" : "Completed"}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-green-600 font-semibold">
                  {campaign.volunteers}
                </div>
                <div className="text-xs text-gray-500">Volunteers</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex-1 px-3 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors duration-300"
            >
              Register
            </button>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-400 hover:to-emerald-500 transition-colors duration-300"
            >
              Donate
            </button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDonateModalOpen && <DonationModal />}
        {isShareModalOpen && <ShareModal />}
        {isMapModalOpen && <MapModal />}
        {isRegisterModalOpen && <RegisterModal />}
      </AnimatePresence>
    </motion.div>
  );
};

export default CampaignCard;
