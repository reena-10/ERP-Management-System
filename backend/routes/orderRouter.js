import express from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getOrders).post(protect, createOrder);
router.route("/:id/status").put(protect, updateOrderStatus);

export default router;
