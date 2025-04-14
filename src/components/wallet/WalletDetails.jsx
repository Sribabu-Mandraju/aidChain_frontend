import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import lottie from "lottie-web";
import connectWallet from "../../assets/lottie/wallet.json";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

const WalletDetails = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      const anim = lottie.loadAnimation({
        container: animationRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: connectWallet,
      });

      return () => anim.destroy();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 sm:py-24 bg-gradient-to-br from-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Wallet Connection
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <div ref={animationRef} className="w-full h-64"></div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Step 1: Connect Your Wallet
                </h3>
                <p className="text-gray-600">
                  Donors begin by connecting their existing crypto wallet or creating a new gasless Smart Wallet through Base.This ensures secure and seamless identity verification for the donation process.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WalletDetails; 