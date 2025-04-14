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
import LearnMoreDetails from "./components/learn-more/LearnMoreDetails";
import ProposalPage from "./pages/PROPOSAL/ProposalPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zk-auth" element={<ZkAadhaarAuth />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dao" element={<DaoPage />} />
        <Route path="/dao/new-proposal" element={<AddProposalPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />

        <Route path="/victim-registration" element={<VictimRegistrationPage />} />
        <Route path="/learn-more-nft" element={<NFTDetails />} />
        <Route path="/learn-more-wallet" element={<WalletDetails />} />
        <Route path="/learn-more-donate" element={<DonateDetails />} />
        <Route path="/learn-more" element={<LearnMoreDetails />} />
        <Route path="/proposals/:id" element={<ProposalPage />} />
        {/* Add more routes as needed */}  dfdfs      rrrr
  );
};

export default App;
