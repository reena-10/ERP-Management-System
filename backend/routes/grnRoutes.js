import express from "express";
import { getGRNs, createGRN } from "../controllers/grnController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getGRNs).post(protect, createGRN);

export default router;
