import React from "react";
import { Link } from "react-router-dom";

const ProposalCard = ({ proposal }) => {
  // Format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate vote percentage
  const calculatePercentage = (forVotes, againstVotes) => {
    const total = forVotes + againstVotes;
    if (total === 0) return { for: 0, against: 0 };

    const forPercentage = Math.round((forVotes / total) * 100);
    return { for: forPercentage, against: 100 - forPercentage };
  };

  const voteCounts =
    proposal.forVotes !== undefined
      ? calculatePercentage(proposal.forVotes, proposal.againstVotes)
      : { for: 0, against: 0 };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          {proposal.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {proposal.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-4">
            <span className="font-medium">Created by:</span>{" "}
            {proposal.createdBy
              ? proposal.createdBy.slice(0, 6) +
                "..." +
                proposal.createdBy.slice(-4)
              : "Unknown"}
          </span>
          <span>
            <span className="font-medium">Date:</span>{" "}
            {formatDate(proposal.createdAt)}
          </span>
        </div>

        {(proposal.forVotes !== undefined ||
          proposal.againstVotes !== undefined) && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>For: {proposal.forVotes || 0}</span>
              <span>Against: {proposal.againstVotes || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${voteCounts.for}%` }}
              ></div>
            </div>
          </div>
        )}

        <Link
          to={`/proposals/${proposal._id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProposalCard;
