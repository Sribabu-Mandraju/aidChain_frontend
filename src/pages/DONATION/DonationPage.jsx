import React from "react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import DonationSection from "../../components/campaigns/campaigns_components/DonationSection";

const DonationPage = () => {
    return (
    <>
        <Navbar />
        <DonationSection />
        <Footer />
    </>        
    )
}

export default DonationPage;