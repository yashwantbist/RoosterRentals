import mongoose from "mongoose";

const profile = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId, ref:"User"},
    userPhoto: String,
    validId: String,
    Location: String,
})

export default mongoose.model('Profile', profile);