require("./config/db");
const http = require("http");

const express = require("express");
const app = express();
const cors = require("cors");
const { initializeSocket } = require("./socket");
const path = require("path");

const server = http.createServer(app);

app.use("/public", express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://chathaven.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
const bodyParser = require("express").json;
const urlEncoded = require("express").urlencoded({ extended: false });
const UserRouter = require("./api/User");
const NotificationRouter = require("./api/Notifications");
const ChatRouter = require("./api/Chat");
// const routes = require("./routes");
app.use(cookieParser());
app.use(bodyParser());
app.use(urlEncoded);

const io = initializeSocket(server);

app.use("/user", UserRouter);
app.use("/notifications", NotificationRouter);
app.use("/chat", ChatRouter);

// app.use(routes);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
