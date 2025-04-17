import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProposalCard from "./ProposalCard";
import { getProposals } from "../../utils/api";
import { useWeb3 } from "../../contexts/Web3Context";

const ProposalList = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { contract } = useWeb3();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);

        // Fetch proposals from backend API
        const response = await getProposals();
        let proposalsData = response.data;

        // If contract is connected, enrich with blockchain data
        if (contract) {
          try {
            const onChainProposalsCount = await contract.getProposalCount();
            if (onChainProposalsCount > 0) {
              const onChainProposals = await contract.getProposals();

              // Merge on-chain data with backend data
              proposalsData = proposalsData.map((proposal) => {
                const onChainProposal = onChainProposals.find(
                  (p) => p.title === proposal.title
                );

                if (onChainProposal) {
                  return {
                    ...proposal,
                    forVotes: parseInt(onChainProposal.forVotes.toString()),
                    againstVotes: parseInt(
                      onChainProposal.againstVotes.toString()
                    ),
                  };
                }

                return proposal;
              });
            }
          } catch (contractError) {
            console.error("Error fetching on-chain proposals:", contractError);
            // Continue with just the backend data
          }
        }

        setProposals(proposalsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError("Failed to load proposals. Please try again later.");
        setLoading(false);
      }
    };

    fetchProposals();
  }, [contract]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          No proposals found
        </h3>
        <p className="text-gray-500 mb-6">
          Be the first to create a proposal for the community to vote on.
        </p>
        <Link
          to="/create-proposal"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Create Proposal
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal._id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
};

export default ProposalList;
