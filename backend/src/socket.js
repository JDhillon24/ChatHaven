require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const Chat = require("./models/Chat");
const User = require("./models/User");

// socket instance
let io;

// map containing all users connected via socket
const users = new Map();

// initializes socket requiring user authentication to complete
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://chathaven.app",
        "https://www.chathaven.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
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
    socket.on("join", (email) => {
      // if user is already contained within the map the socket id is updated
      if (users.has(email)) {
        users.get(email).socketId = socket.id;
      } else {
        // new user is added to the map
        users.set(email, { socketId: socket.id, lastRoom: null });
      }

      // retrieves the user's previously connected room and automatically reconnects if there is a room
      const lastRoom = users.get(email).lastRoom;
      if (lastRoom) {
        socket.join(lastRoom);
        console.log(`${email} just rejoined ${lastRoom}`);
      }
    });

    socket.on("reauthenticate", async ({ token }) => {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        socket.user = decoded;
        console.log(`Reauthenticated user`);
      } catch (err) {
        cconsole.error("Reauthentication failed:", err);
        socket.emit("connect_error", new Error("Invalid or expired token"));
      }
    });

    socket.on("joinRoom", async ({ email, roomId }) => {
      // finds user from map via socket id
      const user = users.get(
        [...users.entries()].find(([_, u]) => u.socketId === socket.id)?.[0]
      );

      if (user) {
        // gets all rooms socket was connected to
        const rooms = Array.from(socket.rooms);

        // leaves all previously connected rooms
        rooms.forEach((r) => {
          if (r !== socket.id) {
            socket.leave(r);
          }
        });

        //updates users last room and connects them to the room
        user.lastRoom = roomId;
        socket.join(roomId);
      }
    });

    socket.on("sendMessage", async ({ roomId, email, text }) => {
      if (!roomId || !email || !text) return;

      const room = await Chat.findById(roomId).populate(
        "participants",
        "email"
      );

      const user = await User.findOne({ email: email });

      if (!room || !user) return;

      // two objects one for appending to the db and one for sending via socket
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

      // emitting a message alert to all participants in the room that are connected via socket
      for (const participant of room.participants) {
        const user = users.get(participant.email);

        if (user?.socketId) {
          io.to(user.socketId).emit("newMessageNotification", true);
        }
      }
    });

    socket.on("disconnect", (reason) => {
      // finds user in map via socket id
      const userEntry = [...users.entries()].find(
        ([_, u]) => u.socketId === socket.id
      );

      // if user is found, clears socket id
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
