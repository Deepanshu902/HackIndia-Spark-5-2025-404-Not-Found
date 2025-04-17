import { Router } from "express";
import {
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
} from "../controller/proposalController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createProposal);
router.get("/", getProposals);
router.get("/:id", getProposalById);
router.patch("/:id", verifyJWT, updateProposal);
router.delete("/:id", verifyJWT, deleteProposal);

export default router;