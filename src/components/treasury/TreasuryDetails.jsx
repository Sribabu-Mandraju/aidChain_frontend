import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import { ethers } from "ethers";

const LearnMoreDetails = () => {
  const [treasuryAmount, setTreasuryAmount] = useState("0");
  const [usdValue, setUsdValue] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreasuryData = async () => {
      try {
        // Replace with your actual contract address and ABI
        const contractAddress = "YOUR_CONTRACT_ADDRESS";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, YOUR_ABI, provider);
        
        // Get treasury balance
        const balance = await contract.getTreasuryBalance();
        const formattedBalance = ethers.utils.formatEther(balance);
        setTreasuryAmount(formattedBalance);

        // Get USD value (you'll need to implement this based on your price feed)
        const usdValue = await contract.getTreasuryUSDValue();
        setUsdValue(usdValue);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching treasury data:", error);
        setLoading(false);
      }
    };

    fetchTreasuryData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Treasury Status{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                  Live Updates
                </span>
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Real-time tracking of our treasury funds and their impact on disaster relief efforts.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2"
              >
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Current Treasury Balance
                  </h3>
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-green-600">
                          {parseFloat(treasuryAmount).toFixed(2)}
                        </span>
                        <span className="ml-2 text-gray-600">ETH</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold text-gray-800">
                          ${parseFloat(usdValue).toLocaleString()}
                        </span>
                        <span className="ml-2 text-gray-600">USD</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2"
              >
                {/* Removed the grid with Total Donations and Active Proposals boxes */}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LearnMoreDetails; 