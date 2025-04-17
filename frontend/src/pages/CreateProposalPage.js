import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import CreateProposal from "../components/proposals/CreateProposal";
import { AuthContext } from "../contexts/AuthContext";

const CreateProposalPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Proposal</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <CreateProposal />
          </div>

          <div className="mt-6">
            <a href="/proposals" className="text-blue-600 hover:text-blue-800">
              ← Back to Proposals
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProposalPage;
