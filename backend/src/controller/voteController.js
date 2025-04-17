import { Vote } from "../models/Vote.js";
import { Proposal } from "../models/Proposal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cast a vote
const castVote = asyncHandler(async (req, res) => {
  const { proposalId, vote } = req.body;
  
  if (!proposalId || !vote) {
    throw new ApiError(400, "Proposal ID and vote are required");
  }

  if (!["for", "against"].includes(vote)) {
    throw new ApiError(400, "Vote must be either 'for' or 'against'");
  }

  // Check if proposal exists
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  const walletAddress = req.user.walletAddress;

  // Check if user has already voted
  const existingVote = await Vote.findOne({
    proposalId,
    voter: walletAddress,
  });

  if (existingVote) {
    throw new ApiError(409, "You have already voted on this proposal");
  }

  // Create new vote
  const newVote = await Vote.create({
    proposalId,
    voter: walletAddress,
    vote,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newVote, "Vote cast successfully"));
});

// Get votes for a specific proposal
const getVotesByProposal = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  
  // Check if proposal exists
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  // Get all votes for this proposal
  const votes = await Vote.find({ proposalId });
  
  // Count votes
  const forVotes = votes.filter(vote => vote.vote === "for").length;
  const againstVotes = votes.filter(vote => vote.vote === "against").length;
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {
          totalVotes: votes.length,
          forVotes,
          againstVotes,
          votes
        },
        "Votes fetched successfully"
      )
    );
});

// Check if a user has voted
const checkUserVote = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const walletAddress = req.user.walletAddress;
  
  const vote = await Vote.findOne({
    proposalId,
    voter: walletAddress,
  });
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        {
          hasVoted: !!vote,
          vote: vote ? vote.vote : null
        },
        "Vote status checked successfully"
      )
    );
});

export{
    castVote,
    getVotesByProposal,
    checkUserVote,
}