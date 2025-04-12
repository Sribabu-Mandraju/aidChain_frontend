import { motion } from "framer-motion";

const CampaignFilters = ({ filter, setFilter }) => {
  const filterOptions = ["All", "Active", "Urgent", "Completed"];

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="flex flex-wrap gap-3 p-1 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
            {filterOptions.map((option) => (
              <motion.button
                key={option}
                onClick={() => setFilter(option)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  filter === option
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-white/80 text-gray-600 hover:bg-green-50"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CampaignFilters;