import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HOME/HomePage";
import ZkAadhaarAuth from "./pages/ZK_AUTH/ZkAuth";
import AboutPage from "./pages/ABOUT/AboutPage";
import DaoPage from "./pages/DAO/DaoPage";
import NewProposalPage from "./pages/NEW_PROPOSAL/NewProposalPage";
import ProposalForm from "./components/add_proposal/AddProposal";
import './index.css'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zk-auth" element={<ZkAadhaarAuth />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dao" element={<DaoPage />} />
        <Route path="/dao/new-proposal" element={<ProposalForm />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
