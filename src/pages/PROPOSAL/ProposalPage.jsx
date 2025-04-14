import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import ProposalDetails from "../../components/proposal/ProposalDetails";

const ProposalPage = () => {
  return (
    <>
      <Navbar />
      <ProposalDetails />
      <Footer />
    </>
  );
};

export default ProposalPage;
