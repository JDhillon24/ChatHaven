const { Server } = require("socket.io");

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

    socket.on("sendMessage", (message) => {
      console.log("Received:", message);
      io.emit("receiveMessage", message);
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
