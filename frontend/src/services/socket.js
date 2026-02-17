import Message from "./models/Message.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    socket.on("join", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", async (data) => {
      const message = await Message.create(data);
      io.to(data.conversation).emit("newMessage", message);
    });
  });
}
