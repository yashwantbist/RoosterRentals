import mongoose from "mongoose";

const paymentHistory = new mongoose.Schema({
    userId:{ type:mongoose.Schema.Types.ObjectId, ref: "User"},
    type: { type: String, enum: ['paid', 'received']},
    amount: Number,
    date:{type: Date, default:Date.now}
});

export default mongoose.model("paymentHistory", paymentHistory)