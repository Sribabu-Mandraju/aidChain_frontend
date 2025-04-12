import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import About from "../../components/about/About";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-green-50">
        <About />
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
