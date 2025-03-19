const { Server } = require("socket.io");
const Chat = require("./models/Chat");
const User = require("./models/User");

let io;
const users = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (email) => {
      users.set(socket.id, email);
      console.log(`User ${email} connected with socket ${socket.id}`);
    });

    socket.on("joinRoom", async ({ email, roomId }) => {
      socket.join(roomId);
      console.log(`User ${email} joined room ${roomId}`);
    });

    socket.on("sendMessage", async ({ roomId, email, text }) => {
      if (!roomId || !email || !text) return;

      const room = await Chat.findById(roomId);

      const user = await User.findOne({ email: email });

      if (!room || !user) return;

      const message = {
        sender: user.id,
        sender_type: "User",
        text: text,
        read: [],
      };

      const socketMessage = {
        sender: user,
        sender_type: "User",
        text: text,
        timestamp: new Date(Date.now()).toISOString(),
        read: [],
      };

      room.messages.push(message);

      await room.save();

      io.to(roomId).emit("newMessage", socketMessage);
    });

    socket.on("disconnect", () => {
      users.delete(socket.id);
      console.log("User disconnected:", socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIo, users };
