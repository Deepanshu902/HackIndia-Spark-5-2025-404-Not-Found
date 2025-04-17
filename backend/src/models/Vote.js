import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true,
  },
  voter: {
    type: String, // wallet address
    required: true,
  },
  vote: {
    type: String,
    enum: ["for", "against"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
// ensure that same wallet cannot vote twice
voteSchema.index({ proposalId: 1, voter: 1 }, { unique: true }); // prevents double voting

export const Vote = mongoose.model("Vote", voteSchema);
