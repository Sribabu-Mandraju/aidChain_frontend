import { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import donation from "../../assets/lottie/donation.json";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const animationContainer = useRef(null); // Ref for Lottie container
  const navigate = useNavigate();

  // Set visibility on mount and initialize Lottie animation
  useEffect(() => {
    setIsVisible(true);

    // Load Lottie animation
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: donation,
      });

      // Cleanup on unmount
      return () => {
        anim.destroy();
      };
    }
  }, []);

  const handleDonateClick = () => {
    // Placeholder for donation functionality
    alert("Redirecting to donation page...");
  };

  const handleLearnMoreClick = () => {
    navigate("/learn-more");
  };

  const stats = [
    { number: "50M+", label: "People Helped" },
    { number: "120+", label: "Countries" },
    { number: "98%", label: "Funds Utilized" },
  ];

  return (
    <section className="relative  mt-[65px] h-screen bg-gradient-to-br from-white to-green-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10b981 1px, transparent 1px),
            linear-gradient(to bottom, #10b981 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Main Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div
          className={`grid lg:grid-cols-2 gap-6 lg:gap-12 items-center transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Left Column - Text Content */}
          <div className="space-y-4 lg:space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full">
              <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              <span className="text-green-800 font-medium text-sm">
                Live Campaign
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Together, We Can{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                Rebuild Lives
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Join our global movement to provide immediate relief and long-term
              recovery support to communities affected by natural disasters.
              Every contribution makes a difference.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDonateClick}
                className="group relative inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                <span className="relative">
                  Donate Now
                  <span className="ml-2">→</span>
                </span>
              </button>

              <button
                onClick={handleLearnMoreClick}
                className="inline-flex items-center px-6 py-3 text-base font-semibold text-green-600 bg-white border-2 border-green-200 rounded-full shadow-sm hover:border-green-300 hover:bg-green-50 transition-all duration-300 hover:scale-105"
              >
                Learn More
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-4 mt-4 border-t border-green-100">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-600">
                    {stat.number}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Lottie Animation */}
          <div className="">
            <div
              ref={animationContainer}
              className="relative z-10 duration-500 w-full h-64 sm:h-80 lg:h-96"
            >
              {/* Lottie animation renders here */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 17.75C960 17.75 1056 35.5 1152 44.375C1248 53.25 1344 53.25 1392 53.25H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
