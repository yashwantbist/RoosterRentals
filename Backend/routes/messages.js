// messages.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timeStamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/chats", async (req, res) => {
  const { sender, receiver, content } = req.body;
  try {
    const message = await Message.create({ sender, receiver, content });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Message send failed" });
  }
});

router.patch("/seen", async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    await Message.updateMany(
      { sender, receiver, seen: false },
      { $set: { seen: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update seen status" });
  }
});

export default router;
