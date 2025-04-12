import { motion } from "framer-motion";

const CampaignHeader = () => {
  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full mb-4">
          <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
          <span className="text-green-800 font-medium text-sm">Live Campaigns</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Join Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
            Relief Campaigns
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Your support empowers communities worldwide. Donate directly to campaigns or our organization using your crypto
          wallet.
        </p>
        {/* <ConnectWallet
          className="!bg-gradient-to-r !from-green-500 !to-emerald-600 !text-white !px-6 !py-3 !rounded-full !font-semibold !hover:shadow-lg !transition-all"
        /> */}
      </motion.div>
    </section>
  );
};

export default CampaignHeader;