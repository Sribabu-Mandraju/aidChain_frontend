import { motion } from "framer-motion";
import { X, Clock, Calendar, DollarSign, UserPlus, Gift, MapPin, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import CampaignMap from "./CampaignMap";
import { useState, useEffect } from "react";

const CampaignDetailsModal = ({ campaign, onClose }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [locationName, setLocationName] = useState("");

  // Get location name from coordinates
  const getLocationName = async (latitude, longitude) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'DisasterReliefApp/1.0',
        },
      });
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return "Location details not available";
    } catch (error) {
      console.error('Geocoding error:', error);
      return "Location details not available";
    }
  };

  // Load location name when component mounts
  useEffect(() => {
    if (campaign.latitude && campaign.longitude) {
      getLocationName(campaign.latitude, campaign.longitude)
        .then(name => setLocationName(name));
    }
  }, [campaign.latitude, campaign.longitude]);

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (endDate) => {
    if (!endDate) return "No end date set";
    
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  // Truncate description with read more/less functionality
  const DescriptionSection = () => {
    const maxLength = 200;
    const shouldTruncate = campaign.description?.length > maxLength && !isDescriptionExpanded;

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">About the Campaign</h3>
            {/* <div className="relative">
            <p className={`text-gray-600 ${shouldTruncate ? 'line-clamp-3' : ''}`}>
                {campaign.description || "No description available"}
            </p>
            {campaign.description?.length > maxLength && (
                <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 flex items-center gap-1"
                >
                {isDescriptionExpanded ? (
                    <>
                    Show less <ChevronUp size={16} />
                    </>
                ) : (
                    <>
                    Read more <ChevronDown size={16} />
                    </>
                )}
                </button>
            )}
            </div> */}
      </div>
    );
  };

  // Location section component
  const LocationSection = () => (
    <div className="bg-blue-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-blue-600" />
        Location Details
      </h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">Location</p>
            <p>{locationName}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">Coordinates</p>
            <p>Lat: {campaign.latitude}, Lon: {campaign.longitude}</p>
          </div>
        </div>
        {campaign.radius && (
          <div className="flex items-start gap-2">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">Affected Radius</p>
              <p>{campaign.radius} km</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Timeline section with available dates
  const TimelineSection = () => {
    const hasTimelineData = campaign.registrationStart || campaign.donationStart || campaign.claimingStart;
    
    if (!hasTimelineData) {
      return (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Timeline</h3>
          <p className="text-gray-600">Timeline information not available</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Timeline</h3>
          {isTimelineExpanded ? (
            <button
              onClick={() => setIsTimelineExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronUp size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsTimelineExpanded(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown size={20} />
            </button>
          )}
        </div>
        
        <div className={`space-y-4 ${isTimelineExpanded ? 'block' : 'hidden'}`}>
          {campaign.registrationStart && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Registration Period</p>
                <p className="text-sm text-gray-600">
                  {formatDate(campaign.registrationStart)} - {formatDate(campaign.registrationEnd)}
                </p>
              </div>
            </div>
          )}
          
          {campaign.donationStart && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Donation Period</p>
                <p className="text-sm text-gray-600">
                  {formatDate(campaign.donationStart)} - {formatDate(campaign.donationEnd)}
                </p>
              </div>
            </div>
          )}
          
          {campaign.claimingStart && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Gift size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Claiming Period</p>
                <p className="text-sm text-gray-600">
                  {formatDate(campaign.claimingStart)} - {formatDate(campaign.claimingEnd)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                campaign.status === "Active" ? "bg-green-500" : 
                campaign.status === "Closed" ? "bg-gray-500" : 
                "bg-yellow-500"
              } text-white`}>
                {campaign.status}
              </span>
              <span className="text-sm text-gray-500">
                {getTimeRemaining(campaign.endDate)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DescriptionSection />
            <LocationSection />
            <TimelineSection />

            {/* Important Notes */}
            <div className="bg-yellow-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-yellow-600" />
                Important Notes
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Registration requires valid proof of victim status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Donations are processed in USDC on Base Sepolia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Claims must be made within the claiming period</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Map */}
            <div className="h-[300px] rounded-xl overflow-hidden">
              <CampaignMap
                latitude={campaign.latitude}
                longitude={campaign.longitude}
                radius={campaign.radius}
                title={campaign.title}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {campaign.totalDonations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Donations</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {campaign.victimsCount || 0}
                </div>
                <div className="text-sm text-gray-600">Registered Victims</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {campaign.amountPerVictim || 0}
                </div>
                <div className="text-sm text-gray-600">Amount per Victim</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {campaign.totalClaims || 0}
                </div>
                <div className="text-sm text-gray-600">Total Claims</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CampaignDetailsModal; 