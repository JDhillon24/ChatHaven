require("./config/db");
const http = require("http");

const express = require("express");
const app = express();
const cors = require("cors");
const { initializeSocket } = require("./socket");
const path = require("path");

// initialize server for socket instance
const server = http.createServer(app);

// allows photos to be found via url
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chathaven.app",
      "https://www.chathaven.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
const bodyParser = require("express").json;
const urlEncoded = require("express").urlencoded({ extended: false });

// routes
const UserRouter = require("./api/User");
const NotificationRouter = require("./api/Notifications");
const ChatRouter = require("./api/Chat");

app.use(cookieParser());
app.use(bodyParser());
app.use(urlEncoded);

const io = initializeSocket(server);

app.use("/user", UserRouter);
app.use("/notifications", NotificationRouter);
app.use("/chat", ChatRouter);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
