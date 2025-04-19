import { motion } from "framer-motion"
import { X, MessageCircle, Twitter, Facebook, Link } from "lucide-react"
import { WhatsappShareButton, TwitterShareButton, FacebookShareButton } from "react-share"

const ShareModal = ({ campaign, onClose }) => {
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/campaigns/${campaign.id}` : ""
  const shareTitle = `Support ${campaign.title} - Help make a difference!`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard!")
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
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Share Campaign</h3>
            <p className="text-sm text-gray-500 mt-1">Help spread the word about {campaign.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <WhatsappShareButton url={shareUrl} title={shareTitle} className="w-full">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 border border-green-100 transition-colors">
                  <MessageCircle size={20} />
                  <span className="font-medium">WhatsApp</span>
                </div>
              </WhatsappShareButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <TwitterShareButton url={shareUrl} title={shareTitle} className="w-full">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                  <Twitter size={20} />
                  <span className="font-medium">Twitter</span>
                </div>
              </TwitterShareButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <FacebookShareButton url={shareUrl} quote={shareTitle} className="w-full">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                  <Facebook size={20} />
                  <span className="font-medium">Facebook</span>
                </div>
              </FacebookShareButton>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyLink}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">
                <Link size={20} />
                <span className="font-medium">Copy Link</span>
              </div>
            </motion.button>
          </div>

          {/* Campaign Link Preview */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">Campaign Link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ShareModal 