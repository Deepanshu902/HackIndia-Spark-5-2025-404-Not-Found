import { Proposal } from "../models/Proposal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create new proposal
const createProposal = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  if ([title, description].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "Title and description are required");
  }

  const proposal = await Proposal.create({
    title,
    description,
    createdBy: req.user.walletAddress,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, proposal, "Proposal created successfully"));
});

// Get all proposals
const getProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({}).sort({ createdAt: -1 });
  
  return res
    .status(200)
    .json(new ApiResponse(200, proposals, "Proposals fetched successfully"));
});

// Get proposal by ID
const getProposalById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const proposal = await Proposal.findById(id);

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, proposal, "Proposal fetched successfully"));
});

// Update proposal
const updateProposal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  
  const proposal = await Proposal.findById(id);

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  // Check if user owns the proposal
  if (proposal.createdBy !== req.user.walletAddress) {
    throw new ApiError(403, "You are not authorized to update this proposal");
  }

  if (title) proposal.title = title;
  if (description) proposal.description = description;

  await proposal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, proposal, "Proposal updated successfully"));
});

// Delete proposal
const deleteProposal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const proposal = await Proposal.findById(id);

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  // Check if user owns the proposal
  if (proposal.createdBy !== req.user.walletAddress) {
    throw new ApiError(403, "You are not authorized to delete this proposal");
  }

  await Proposal.deleteOne({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Proposal deleted successfully"));
});

export{
    createProposal,
    getProposalById,
    updateProposal,
    deleteProposal,
    getProposals
}