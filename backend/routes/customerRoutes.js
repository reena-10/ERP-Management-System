import express from "express";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all customer routes
router.route("/").get(protect, getCustomers).post(protect, createCustomer);
router.route("/:id").delete(protect, deleteCustomer);

export default router;
