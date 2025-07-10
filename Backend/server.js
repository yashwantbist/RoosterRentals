import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./Config/database.js";
import authRoutes from "./routes/authRoutes.js";
import rentalInfoRoutes from "./routes/rentalInfoRoutes.js";
import paymentRoutes from "./routes/payment.js";
import stripeRoutes from "./routes/stripe.js";
import messagesRoutes from "./routes/messages.js";
import setupSocket from "./routes/socket.js";
import myrentals from "./routes/myrentals.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", rentalInfoRoutes);
app.use("/api", paymentRoutes);
app.use("/api", stripeRoutes);
app.use("/", rentalInfoRoutes);
app.use("/api/myrentals", myrentals);
console.log("messagesRoutes:", messagesRoutes);
app.use("/api", messagesRoutes);

const server = http.createServer(app);
setupSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
