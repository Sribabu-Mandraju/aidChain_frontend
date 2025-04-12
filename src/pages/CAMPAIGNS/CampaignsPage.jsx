import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import CampaignsSection from "../../components/campaigns/Campaigns";
const CampaignsPage = () => {
  return (
    <>
      <Navbar />
      <CampaignsSection />
      <Footer />
    </>
  );
};

export default CampaignsPage;
