import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: String,
    seen: { type: Boolean, default: false },
    timeStamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
