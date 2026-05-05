import express from "express";
import {
  getProducts,
  createProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Notice: Routes are protected by JWT middleware
router.route("/").get(protect, getProducts).post(protect, createProduct);

export default router;
