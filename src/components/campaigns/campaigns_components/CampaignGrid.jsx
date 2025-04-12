import { motion } from "framer-motion";
import CampaignCard from "../../shared/CampaignCard";

const CampaignGrid = ({ campaigns }) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {campaigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 py-12"
          >
            <p className="text-lg font-medium">No campaigns found for this filter.</p>
            <p className="text-sm mt-2">Try selecting a different status or check back later.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CampaignCard campaign={campaign} index={index} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignGrid;