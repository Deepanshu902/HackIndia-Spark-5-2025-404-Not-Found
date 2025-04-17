import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Web3Context } from "../../contexts/Web3Context";

const VoteButtons = ({ proposalId, currentVotes, onVoteSuccess }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { contract } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVote = async (support) => {
    if (!isAuthenticated) {
      setError("You must be logged in to vote");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await contract.castVote(proposalId, support);

      setLoading(false);
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to cast vote");
      console.error("Vote error:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mt-4">
      <button
        onClick={() => handleVote(true)}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Vote For"} ({currentVotes?.for || 0})
      </button>

      <button
        onClick={() => handleVote(false)}
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Vote Against"} (
        {currentVotes?.against || 0})
      </button>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default VoteButtons;
