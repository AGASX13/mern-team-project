import { Router } from "express";
import { 
    register, 
    login, 
    logout, 
    refreshAccessToken, 
    changePassword, 
    forgotPassword, 
    resetPassword,
    verifyOtp
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// === Public Routes ===
router.post("/register", register);
router.post("/verify-email", verifyOtp);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// === Protected Routes (Token Required) ===
router.post("/logout", authMiddleware, logout);
router.post("/change-password", authMiddleware, changePassword);

export default router;
