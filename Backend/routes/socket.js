import { Server } from "socket.io";
import Message from "../models/Message.js";

export default function setupSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room: ${userId}`);
      }
    });

    socket.on("send_message", async ({ sender, receiver, content }) => {
      try {
        if (!sender || !receiver || !content) {
          console.error("send_message missing fields:", { sender, receiver, content });
          return;
        }
        const message = await Message.create({ sender, receiver, content });
        io.to(receiver).emit("receive_message", message);
      } catch (error) {
        console.error("Error in send_message:", error);
      }
    });

    socket.on("mark_seen", async ({ sender, receiver }) => {
      try {
        if (!sender || !receiver) {
          console.error("mark_seen missing fields:", { sender, receiver });
          return;
        }
        await Message.updateMany(
          { sender, receiver, seen: false },
          { $set: { seen: true } }
        );
        io.to(sender).emit("messages_seen", { by: receiver });
      } catch (error) {
        console.error("Error in mark_seen:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
