import { Router } from "express";
import {
  castVote,
  getVotesByProposal,
  checkUserVote,
} from "../controller/voteController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, castVote);
router.get("/proposal/:proposalId", getVotesByProposal);
router.get("/check/:proposalId", verifyJWT, checkUserVote);

export default router;
