import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import CampaignList from "../shared/campaignCard_components/CampaignList";
import { 
  fetchCampaigns, 
  setFilter,
  clearCampaigns,
  selectFilteredCampaigns,
  selectCampaignsLoading,
  selectCampaignsError,
  selectCurrentFilter,
  selectLastFetchTime,
  selectHasCampaigns
} from "../../store/slices/campaignSlice";

const Campaigns = () => {
  const dispatch = useDispatch();
  const filteredCampaigns = useSelector(selectFilteredCampaigns);
  const loading = useSelector(selectCampaignsLoading);
  const error = useSelector(selectCampaignsError);
  const filter = useSelector(selectCurrentFilter);
  const lastFetchTime = useSelector(selectLastFetchTime);
  const hasCampaigns = useSelector(selectHasCampaigns);

  // Only fetch campaigns if there's no existing data
  useEffect(() => {
    if (!hasCampaigns) {
      dispatch(fetchCampaigns());
    }
  }, [dispatch, hasCampaigns]);

  const handleRefresh = () => {
    dispatch(clearCampaigns());
    dispatch(fetchCampaigns());
  };

  const filterOptions = ["All", "Active", "Registration", "Waiting", "Distribution", "Closed"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  console.log(filteredCampaigns);

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-white to-green-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center gap-4">
            <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full mb-4">
              <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              <span className="text-green-800 font-medium text-sm">
                Live Campaigns
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-1.5 bg-white text-green-600 border border-green-200 rounded-full mb-4 hover:bg-green-50 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Support Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Relief Campaigns
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Your donations help us provide critical aid to those in need. Join
            our global community of donors making a real difference.
          </p>
        </motion.div>

        {/* Filter Options */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-3 p-1 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => dispatch(setFilter(option))}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  filter === option
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-white/80 text-gray-600 hover:bg-green-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="w-full max-w-7xl mx-auto">
          {filteredCampaigns.length > 0 ? (
            <CampaignList campaigns={filteredCampaigns} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No campaigns found matching the selected filter.</p>
            </div>
          )}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-8 py-3 bg-white text-green-600 border-2 border-green-200 rounded-full font-semibold hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-sm">
            View All Campaigns
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Campaigns;