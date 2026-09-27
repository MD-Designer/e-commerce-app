import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute ,getProfile);

export default router;
