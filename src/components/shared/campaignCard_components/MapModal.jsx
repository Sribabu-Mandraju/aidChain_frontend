import { motion } from "framer-motion"
import { X, MapPin, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"

const MapModal = ({ campaign, onClose }) => {
  const handleOpenGoogleMaps = () => {
    if (!campaign.latitude || !campaign.longitude) {
      toast.error("Location data not available")
      return
    }
    window.open(
      `https://www.google.com/maps?q=${campaign.latitude},${campaign.longitude}`,
      "_blank"
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Campaign Location</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Map Preview */}
          <div className="relative h-[300px] bg-gray-100 rounded-xl overflow-hidden">
            {campaign.latitude && campaign.longitude ? (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${campaign.latitude},${campaign.longitude}`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Location data not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-gray-900 font-medium">
                  {campaign.location || "Location not specified"}
                </p>
              </div>
              {campaign.latitude && campaign.longitude && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenGoogleMaps}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Open in Maps
                </motion.button>
              )}
            </div>
          </div>

          {/* Additional Location Information */}
          {campaign.locationDetails && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-800 text-sm leading-relaxed">
                {campaign.locationDetails}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MapModal 