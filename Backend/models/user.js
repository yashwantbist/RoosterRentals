import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: Date,
  phone: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);
