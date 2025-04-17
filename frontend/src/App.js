import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProposalsPage from "./pages/ProposalsPage";
import CreateProposalPage from "./pages/CreateProposalPage";
import ProposalDetailPage from "./pages/ProposalDetailPage";

// Import styles
import "./App.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/create-proposal" element={<CreateProposalPage />} />
            <Route
              path="/proposals/:proposalId"
              element={<ProposalDetailPage />}
            />

            {/* Redirect for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
};

export default App;
