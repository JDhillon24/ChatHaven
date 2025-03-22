require("dotenv");
const jwt = require("jsonwebtoken");
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

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(
          new Error("Authentication error: invalid or expired token")
        );
      }

      socket.user = decoded;
      next();
    });
  });

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("join", (email) => {
      if (users.has(email)) {
        users.get(email).socketId = socket.id;
      } else {
        users.set(email, { socketId: socket.id, lastRoom: null });
      }

      const lastRoom = users.get(email).lastRoom;
      // console.log(lastRoom);
      if (lastRoom) {
        socket.join(lastRoom);
        console.log(`${email} just rejoined ${lastRoom}`);
      }

      // console.log(users);
    });

    socket.on("reauthenticate", async ({ token }) => {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.user = decoded;
        console.log(`Reauntheticated user`);
      } catch (err) {
        cconsole.error("Reauthentication failed:", err);
        socket.emit("connect_error", new Error("Invalid or expired token"));
      }
    });

    socket.on("joinRoom", async ({ email, roomId }) => {
      const user = users.get(
        [...users.entries()].find(([_, u]) => u.socketId === socket.id)?.[0]
      );

      if (user) {
        const rooms = Array.from(socket.rooms);

        rooms.forEach((r) => {
          if (r !== socket.id) {
            socket.leave(r);
          }
        });

        user.lastRoom = roomId;
        socket.join(roomId);
      }
      // console.log(user);
      // console.log(socket.rooms);
      // console.log(`User ${email} joined room ${roomId}`);
    });

    socket.on("sendMessage", async ({ roomId, email, text }) => {
      if (!roomId || !email || !text) return;

      io.in(roomId)
        .fetchSockets()
        .then((sockets) => {
          console.log(
            `Users in room ${roomId}:`,
            sockets.map((s) => s.id)
          );
        });

      const room = await Chat.findById(roomId).populate(
        "participants",
        "email"
      );

      const user = await User.findOne({ email: email });

      if (!room || !user) return;

      const message = {
        sender: user.id,
        sender_type: "User",
        text: text,
        read: [user.id],
      };

      const socketMessage = {
        sender: user,
        sender_type: "User",
        text: text,
        timestamp: new Date(Date.now()).toISOString(),
        read: [user.id],
      };

      room.messages.push(message);
      await room.save();

      io.to(roomId).emit("newMessage", socketMessage);
      console.log(`Emitting to room ${roomId}: ${socketMessage}`);

      for (const participant of room.participants) {
        const user = users.get(participant.email);

        if (user?.socketId) {
          io.to(user.socketId).emit("newMessageNotification", true);
        }
      }
    });

    socket.on("disconnect", (reason) => {
      const userEntry = [...users.entries()].find(
        ([_, u]) => u.socketId === socket.id
      );

      if (userEntry) {
        users.set(userEntry[0], {
          lastRoom: userEntry[1].lastRoom,
          socketId: null,
        });
      }

      console.log(`User ${socket.id} disconnected due to ${reason}`);
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
