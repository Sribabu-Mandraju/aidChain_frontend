import React from "react";
import Navbar from '../../components/home/Navbar'
import Footer from '../../components/home/Footer'
import CampaignDetails from "../../components/campaign_details/CampaignDetails";
 

const CampaignDetailsPage = () => {
    return (
        <>
            <Navbar />
            <CampaignDetails />
            <Footer />
        </>
    )
}

export default CampaignDetailsPage