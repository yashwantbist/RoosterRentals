import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { full_name, email, password, dob, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: full_name,
      email,
      password: hashedPassword,
      dob,
      phone,
    });
    await newUser.save();

    res.status(201).json({ message: "Signup successful", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Get Profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Change Email
router.post("/email", authenticate, async (req, res) => {
  const { newEmail } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, { email: newEmail });
    res.send({ message: "Email updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update email" });
  }
});

// Forgot Password (Dummy)
router.post("/forgotpassword", async (req, res) => {
  res.send({ message: "Reset link sent to email" });
});

// Logout (Dummy)
router.post("/logout", (req, res) => {
  res.send({ message: "Logged out" });
});

export default router;
