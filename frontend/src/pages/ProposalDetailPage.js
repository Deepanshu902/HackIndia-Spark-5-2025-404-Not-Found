import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProposalDetail from "../components/proposals/ProposalDetail";
import VoteButtons from "../components/votes/VoteButtons";
import { fetchProposalById } from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";

const ProposalDetailPage = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  const loadProposalData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProposalById(proposalId);
      setProposal(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load proposal details");
      setLoading(false);
      console.error("Error fetching proposal:", err);
    }
  }, [proposalId]);

  useEffect(() => {
    if (proposalId) {
      loadProposalData();
    }
  }, [proposalId, loadProposalData]);

  const handleVoteSuccess = () => {
    // Reload proposal data to update vote counts
    loadProposalData();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/proposals" className="text-blue-600 hover:text-blue-800">
            ← Back to Proposals
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading proposal details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : proposal ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ProposalDetail proposal={proposal} />

            <div className="px-6 py-4 bg-gray-50 border-t">
              <h3 className="text-lg font-semibold mb-2">Cast Your Vote</h3>

              {isAuthenticated ? (
                <VoteButtons
                  proposalId={proposalId}
                  currentVotes={proposal.votes}
                  onVoteSuccess={handleVoteSuccess}
                />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-yellow-700">
                    Please{" "}
                    <Link to="/login" className="font-medium underline">
                      log in
                    </Link>{" "}
                    to cast your vote on this proposal.
                  </p>
                </div>
              )}
            </div>

            {proposal.completed && (
              <div className="px-6 py-4 bg-blue-50 border-t">
                <h3 className="text-lg font-semibold mb-2">Final Results</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-md">
                    <span className="font-bold">
                      {proposal.votes?.for || 0}
                    </span>{" "}
                    Votes For
                  </div>
                  <div className="bg-red-100 p-3 rounded-md">
                    <span className="font-bold">
                      {proposal.votes?.against || 0}
                    </span>{" "}
                    Votes Against
                  </div>
                  <div className="ml-auto">
                    <span className="font-bold">
                      {proposal.votes?.for > proposal.votes?.against
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Proposal not found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProposalDetailPage;
