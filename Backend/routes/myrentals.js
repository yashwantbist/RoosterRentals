import express from "express";
import MyRental from "../models/myrental.js";

const router = express.Router();

// Mock auth middleware (replace with real one later)
function authMiddleware(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// Get user's rentals
router.get("/", authMiddleware, async (req, res) => {
  try {
    const rentals = await MyRental.findOne({ userId: req.user._id });
    if (!rentals) return res.status(404).json({ message: "No rentals found" });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add inventory post
router.post("/inventory", authMiddleware, async (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).json({ error: "Item is required" });

  try {
    let rentals = await MyRental.findOne({ userId: req.user._id });
    if (!rentals) {
      rentals = new MyRental({ userId: req.user._id, inventory: [], rentalAgreements: [], rentalScore: 0 });
    }
    rentals.inventory.push(item);
    await rentals.save();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
