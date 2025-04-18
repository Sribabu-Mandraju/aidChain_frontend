import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HOME/HomePage";
import ZkAadhaarAuth from "./pages/ZK_AUTH/ZkAuth";
import AboutPage from "./pages/ABOUT/AboutPage";
import DaoPage from "./pages/DAO/DaoPage";
import AddProposalPage from "./pages/ADD_PROPOSAL/AddProposalPage";
import "./index.css";
import CampaignsPage from "./pages/CAMPAIGNS/CampaignsPage";
import VictimRegistrationPage from "./components/victim_registration/VictimRegestration";
import NFTDetails from "./components/nft/NFTDetails";
import WalletDetails from "./components/wallet/WalletDetails";
import DonateDetails from "./components/donate/DonateDetails";
import TreasuryDetails from "./components/treasury/TreasuryDetails";
import ProposalPage from "./pages/PROPOSAL/ProposalPage";
import SimpleAadhaarLogin from "./components/victim_registration/SS";
import DonationPage from "./pages/DONATION/DonationPage";

import TestLocation from "./components/shared/campaignCard_components/TestLocation";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zk-auth" element={<ZkAadhaarAuth />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dao" element={<DaoPage />} />
        <Route path="/dao/new-proposal" element={<AddProposalPage />} />
        <Route path="/dao/treasury" element={<TreasuryDetails />} />
        <Route path="/campaigns" element={<CampaignsPage />} />

        <Route path="/victim-registration/:id" element={<VictimRegistrationPage />} />
        <Route path="/learn-more-nft" element={<NFTDetails />} />
        <Route path="/learn-more-wallet" element={<WalletDetails />} />
        <Route path="/learn-more-donate" element={<DonateDetails />} />
        <Route path="/proposals/:id" element={<ProposalPage />} />
        <Route path="/sal" element={<SimpleAadhaarLogin />} />
        <Route path="/test" element={<TestLocation />} />
        <Route path="/donation" element={<DonationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
