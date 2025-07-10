import express from "express";
import PaymentHistory from "../models/PaymentHistory.js";

const router = express.Router();

// POST payment
router.post("/", async (req, res) => {
  try {
    const { userId, type, amount } = req.body;

    if (!userId || !type || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPayment = new PaymentHistory({ userId, type, amount });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    console.error("Error posting payment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET payment history
router.get("/:userId", async (req, res) => {
  try {
    const payments = await PaymentHistory.find({ userId: req.params.userId });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
