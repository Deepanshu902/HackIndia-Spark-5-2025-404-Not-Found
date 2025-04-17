
import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String, // wallet address
    required: true,
  },
  
},{timestamps:true});

export const Proposal =  mongoose.model("Proposal", proposalSchema);
