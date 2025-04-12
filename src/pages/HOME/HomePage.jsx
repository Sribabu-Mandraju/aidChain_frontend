import React from "react";
import Hero from "../../components/home/Hero";
import Navbar from "../../components/home/Navbar";
import About from "../../components/home/About";
import Footer from "../../components/home/Footer";
import Campaigns from "../../components/home/Campaigns";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Campaigns />
      <Footer />
    </>
  );
};

export default HomePage;
