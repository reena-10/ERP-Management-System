import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getProducts).post(protect, createProduct);
router.route("/:id").delete(protect, deleteProduct);

export default router;
