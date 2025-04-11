import React from "react";
import Hero from "../../components/home/Hero";
import Navbar from "../../components/home/Navbar";
import About from "../../components/home/About";
import Footer from "../../components/home/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Footer />
    </>
  );
};

export default HomePage;
