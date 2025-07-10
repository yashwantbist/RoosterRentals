// routes/rentalInfoRoutes.js
import express from "express";
import authenticate from "../middleware/authenticate.js";
const router = express.Router();
import RentalInfo from "../models/rentalInfo.js";

// GET all rentals
router.get('/rentals', async (req, res) => {
  console.log("Incoming filters:", req.query);
  try {
    const { city, bhk, minPrice, maxPrice, amenities, username } = req.query;
    const filter = {};

    if (city) {
      filter.location = { $regex: new RegExp(city, 'i') };
    }
    if (bhk) {
      filter['roomDetails.bedroom'] = bhk;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice, 10);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice, 10);
    }
    if (amenities) {
      amenities.split(',').forEach(a => {
        const key = `amenities.${a}`;
        filter[key] = true;
      });
    }

    const rentalsQuery = RentalInfo.find(filter)
      .populate("userId", "fullName")
      .populate("commentsAndReviews.userId", "fullName");

    let rentals = await rentalsQuery.exec();

    if (username) {
      rentals = rentals.filter(r =>
        r.userId?.fullName?.toLowerCase().includes(username.toLowerCase())
      );
    }

    res.json(rentals);
  } catch (err) {
    console.error("Error in /api/rentals:", err);
    res.status(500).json({ error: err.message });
  }
});



//post the rentals 
router.post('/rentals/post',authenticate, async (req, res) =>{
  try {
    const rentalData = {
      ...req.body,
      userId: req.user.userId
    };
    const newRental = new RentalInfo(rentalData);
    const saved = await newRental.save();
    res.status(201).json(saved);
  }
  catch(error){
    res.status(500).json({message: "Server error", error});
  }
} )



export default router;