import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile,
  refreshAccessToken
} from "../controller/authController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyWalletSignature } from "../middleware/walletVerify.middleware.js";

const router = Router();

router.post("/register", verifyWalletSignature, registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getUserProfile);
router.post("/refresh-token", refreshAccessToken);

export default router;
