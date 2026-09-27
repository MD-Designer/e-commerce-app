import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  getCategoryProducts,
  createProduct,
  toggleFeaturedProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/",  getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getCategoryProducts);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
export default router;
