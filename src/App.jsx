import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HOME/HomePage";
import ZkAadhaarAuth from "./pages/ZK_AUTH/ZkAuth";
import AboutPage from "./pages/ABOUT/AboutPage";
import DaoPage from "./pages/DAO/DaoPage";
import AddProposalPage from "./pages/ADD_PROPOSAL/AddProposalPage";
import './index.css'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/zk-auth" element={<ZkAadhaarAuth />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dao" element={<DaoPage />} />
        <Route path="/dao/new-proposal" element={<AddProposalPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
