import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import NewProposal from "../../components/new_proposal/NewProposal";

const NewProposalPage = () => {
  return (
    <>
      <Navbar />
      <NewProposal />
      <Footer />
    </>
  );
};

export default NewProposalPage;
