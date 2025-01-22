import express from "express";
import { checkout, getPurchaseStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", checkout);
router.get("/purchase-status", getPurchaseStatus);

export default router;