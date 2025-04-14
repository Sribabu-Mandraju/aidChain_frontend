import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import lottie from "lottie-web";
import selectDonate from "../../assets/lottie/donation.json";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

const DonateDetails = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      const anim = lottie.loadAnimation({
        container: animationRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: selectDonate,
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
                Donation <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Process</span>
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Learn more about how to select and make your donation to support disaster relief efforts.
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
                  Step 2: Select and Donate
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                  Donors can either click the Donate button in the header or choose a specific disaster campaign to support. They then select the amount and confirm the transaction via their wallet.
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
                      <p className="text-base text-gray-600">Choose from various disaster campaigns</p>
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
                      <p className="text-base text-gray-600">Select your donation amount</p>
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
                      <p className="text-base text-gray-600">Confirm transaction through your wallet</p>
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

export default DonateDetails; 