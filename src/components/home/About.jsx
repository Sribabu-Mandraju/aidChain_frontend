import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import lottie from "lottie-web";

// Lottie animation files
import connectWallet from "../../assets/lottie/wallet.json";
import selectDonate from "../../assets/lottie/donation.json";
import nftBadge from "../../assets/lottie/nft.json";

const About = () => {
  // Animation variants for text
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for Lottie containers
  const lottieVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Content for each section with Lottie animations
  const steps = [
    {
      title: "Step 1: Connect Your Wallet",
      description:
        "Donors begin by connecting their existing crypto wallet or creating a new gasless Smart Wallet through Base. This ensures secure and seamless identity verification for the donation process.",
      animation: connectWallet,
    },
    {
      title: "Step 2: Select and Donate",
      description:
        "Donors can either click the Donate button in the header or choose a specific disaster campaign to support. They then select the amount and confirm the transaction via their wallet.",
      animation: selectDonate,
    },
    {
      title: "Step 3: Receive NFT Badge",
      description:
        "After a successful donation, the donor is rewarded with a unique NFT appreciation badge. This serves as a digital token of gratitude and proof of their impact.",
      animation: nftBadge,
    },
  ];

  // Create refs for each Lottie container
  const animationRefs = useRef(steps.map(() => ({ current: null })));

  // Initialize and clean up Lottie animations
  useEffect(() => {
    const animations = steps.map((step, index) => {
      if (animationRefs.current[index].current) {
        return lottie.loadAnimation({
          container: animationRefs.current[index].current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: step.animation,
        });
      }
      return null;
    });

    // Cleanup on unmount
    return () => {
      animations.forEach((anim) => anim?.destroy());
    };
  }, []); // Empty dependency array since `steps` is static

  return (
    <section
      id="about"
      className="py-16 sm:py-24 bg-gradient-to-br from-white to-green-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Join our mission to make a difference with a seamless, secure, and
            rewarding donation process powered by blockchain technology.
          </p>
        </motion.div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-8 sm:gap-12 mb-16 sm:mb-24 last:mb-0`}
          >
            {/* Lottie Animation */}
            <motion.div
              variants={lottieVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-1/2 relative"
            >
              <div
                ref={animationRefs.current[index]}
                className="w-full h-64 sm:h-80"
              >
                {/* Lottie animation renders here */}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-full md:w-1/2"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {step.description}
              </p>
              <div className="mt-6">
                {index === 0 ? (
                  <a
                    href="/learn-more-wallet"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
                  >
                    Learn More
                  </a>
                ) : index === 1 ? (
                  <a
                    href="/learn-more-donate"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
                  >
                    Learn More
                  </a>
                ) : index === 2 ? (
                  <a
                    href="/learn-more-nft"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold text-sm sm:text-base shadow-md hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
                  >
                    Learn More
                  </a>
                ) : null}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
