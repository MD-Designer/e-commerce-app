import express from "express";
import {
  addToCart,
  deleteFromCart,
  getCartProducts,
  updateCartItem,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, deleteFromCart);
router.put("/:id", protectRoute, updateCartItem);

export default router;
