import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProposalList from "../components/proposals/ProposalList";
import { fetchRecentProposals } from "../utils/api";

const HomePage = () => {
  const [recentProposals, setRecentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecentProposals = async () => {
      try {
        setLoading(true);
        const proposals = await fetchRecentProposals(3); // Fetch top 3 recent proposals
        setRecentProposals(proposals);
        setLoading(false);
      } catch (err) {
        setError("Failed to load recent proposals");
        setLoading(false);
        console.error("Error fetching recent proposals:", err);
      }
    };

    getRecentProposals();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Decentralized Voting Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Submit proposals and vote on important decisions in a transparent
            way
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/proposals"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Browse Proposals
            </Link>
            <Link
              to="/create-proposal"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Create Proposal
            </Link>
          </div>
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Recent Proposals</h2>
          {loading ? (
            <div className="text-center py-8">Loading recent proposals...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <ProposalList proposals={recentProposals} />
              <div className="text-center mt-8">
                <Link
                  to="/proposals"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Proposals →
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-100 rounded-lg p-8 my-12">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">
                1. Create a Proposal
              </h3>
              <p className="text-gray-600">
                Submit your proposal with a clear title, description, and voting
                options.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">
                2. Community Voting
              </h3>
              <p className="text-gray-600">
                Members cast their votes on proposals using secure blockchain
                technology.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">
                3. Decision Implementation
              </h3>
              <p className="text-gray-600">
                Once voting ends, results are tallied and the decision is
                implemented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
