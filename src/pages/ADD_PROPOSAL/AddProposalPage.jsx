import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import ProposalForm from "../../components/add_proposal/AddProposal";
const AddProposalPage = () => {
  return (
    <>
      <Navbar />
      <div className="mt-[60px]">
        <ProposalForm />
      </div>
      <Footer />
    </>
  );
};

export default AddProposalPage;
