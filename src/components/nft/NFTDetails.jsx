import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import lottie from "lottie-web";
import nftBadge from "../../assets/lottie/nft.json";
import firstContributorBadge from "../../assets/nftBadges/goldenbadge2.png";
import secondContributorBadge from "../../assets/nftBadges/goldenbadge3.png";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

const NFTDetails = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      const anim = lottie.loadAnimation({
        container: animationRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: nftBadge,
      });

      return () => anim.destroy();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="relative py-16 sm:py-24 bg-gradient-to-br from-white to-green-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                NFT Badge <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Details</span>
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Learn more about our unique NFT appreciation badges and how they represent your impact.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2 relative"
              >
                <div ref={animationRef} className="w-full h-64 sm:h-80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2"
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Step 3: Receive NFT Badge
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                  After a successful donation, the donor is rewarded with a unique NFT appreciation badge. This serves as a digital token of gratitude and proof of their impact.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Unique digital collectible</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Proof of your charitable contribution</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Stored securely on the blockchain</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* NFT Badges Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">NFT Badges</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Earn exclusive NFT badges based on your contribution timing and amount.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* NFT Badge 1 - First Contributor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">First Contributor Badge</h3>
                <div className="aspect-w-1 aspect-h-1 w-full rounded-xl overflow-hidden mb-6">
                  <img 
                    src={firstContributorBadge} 
                    alt="First Contributor Badge" 
                    className="w-full h-64 object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Awarded to the very first donor on our platform</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Exclusive design for the pioneer supporter</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* NFT Badge 2 - Second Contributor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Second Contributor Badge</h3>
                <div className="aspect-w-1 aspect-h-1 w-full rounded-xl overflow-hidden mb-6">
                  <img 
                    src={secondContributorBadge} 
                    alt="Second Contributor Badge" 
                    className="w-full h-64 object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Awarded to the second donor on our platform</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-600">Special design for the early follower</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NFTDetails;