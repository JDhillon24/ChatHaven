require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const app = require("express")();
const cors = require("cors");

const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
const bodyParser = require("express").json;
const urlEncoded = require("express").urlencoded({ extended: false });
const UserRouter = require("./api/User");
const NotificationRouter = require("./api/Notifications");
// const routes = require("./routes");
app.use(cookieParser());
app.use(bodyParser());
app.use(urlEncoded);

const users = new Map();

const io = new Server(server, {
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

app.use("/user", UserRouter);
app.use("/notifications", NotificationRouter);

const sendNotification = (email, notification) => {
  const socketId = [...users.entries()].find(([_, id]) => id === email)?.[0];

  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
};

// app.use(routes);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { sendNotification };
