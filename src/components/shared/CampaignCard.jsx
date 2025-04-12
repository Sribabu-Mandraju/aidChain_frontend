"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Gift,
  Share2,
  Link,
  X,
  MessageCircle, // Replaced Whatsapp with MessageCircle
  Twitter,
  Facebook,
} from "lucide-react";
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton } from "react-share";

const CampaignCard = ({ campaign, index }) => {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Share URL (adjust based on your domain)
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/campaigns/${campaign.id}` : "";
  const shareTitle = `Support ${campaign.title} - Help make a difference!`;

  // Handle Details redirect
  const handleDetails = () => {
    navigate(`/campaigns/${campaign.id}`);
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

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
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
          Your donation will help {campaign.title.toLowerCase()}. Every contribution counts!
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
    >
      {/* Card Image */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        <img
          src={campaign.image || "/placeholder.svg"}
          alt={campaign.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 p-4">
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
      </div>

      {/* Card Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
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
        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-green-600 font-semibold">
              {campaign.donors}
            </div>
            <div className="text-xs text-gray-500">Donors</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-green-600 font-semibold">
              {campaign.daysLeft > 0 ? `${campaign.daysLeft} Days` : "Completed"}
            </div>
            <div className="text-xs text-gray-500">
              {campaign.daysLeft > 0 ? "Left" : ""}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDetails}
            className="flex-1 px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors duration-300"
          >
            Learn More
          </button>
          <button
            onClick={() => setIsDonateModalOpen(true)}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-400 hover:to-emerald-500 transition-colors duration-300"
          >
            Donate Now
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
          >
            <Share2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDonateModalOpen && <DonationModal />}
        {isShareModalOpen && <ShareModal />}
      </AnimatePresence>
    </motion.div>
  );
};

export default CampaignCard;