import mongoose from "mongoose";

const myrental = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    rentalAgreements: [String],
    rentalScore: Number,
    inventory: [String]
});

export default mongoose.model("myrental", myrental);