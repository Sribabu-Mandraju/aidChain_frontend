import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

const CampaignFooter = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore more campaigns or reach out to learn how you can contribute
            further.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              href="/campaigns"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              View All Campaigns
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
            <motion.a
              href="mailto:support@relief.org"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-white text-green-600 border-2 border-green-200 rounded-full font-semibold hover:border-green-300 hover:bg-green-50 transition-all"
            >
              Contact Us
              <Mail className="ml-2 w-5 h-5" />
            </motion.a>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            © 2025 Disaster Relief Organization. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CampaignFooter;
