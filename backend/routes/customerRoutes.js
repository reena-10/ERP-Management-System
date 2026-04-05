import express from "express";
import {
  getCustomers,
  createCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// protect middleware ensure karega ki sirf logged-in user hi in API ko use kar sake
router.route("/").get(protect, getCustomers).post(protect, createCustomer);

export default router;
