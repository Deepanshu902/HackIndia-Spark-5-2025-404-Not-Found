import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProposalList from "../components/proposals/ProposalList";
import { fetchAllProposals } from "../utils/api";
import { AuthContext } from "../contexts/AuthContext";

const ProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProposals();
        setProposals(data);
        setFilteredProposals(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load proposals");
        setLoading(false);
        console.error("Error fetching proposals:", err);
      }
    };

    loadProposals();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...proposals];

    // Apply status filter
    if (filter === "active") {
      result = result.filter((proposal) => !proposal.completed);
    } else if (filter === "completed") {
      result = result.filter((proposal) => proposal.completed);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (proposal) =>
          proposal.title.toLowerCase().includes(term) ||
          proposal.description.toLowerCase().includes(term)
      );
    }

    setFilteredProposals(result);
  }, [filter, searchTerm, proposals]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Proposals</h1>

          {isAuthenticated && (
            <Link
              to="/create-proposal"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Proposal
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Proposals</option>
                <option value="active">Active Proposals</option>
                <option value="completed">Completed Proposals</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading proposals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No proposals found.</p>
          </div>
        ) : (
          <ProposalList proposals={filteredProposals} />
        )}
      </div>
    </Layout>
  );
};

export default ProposalsPage;
