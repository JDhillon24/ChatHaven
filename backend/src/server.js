require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const app = require("express")();
const cors = require("cors");
const { initializeSocket } = require("./socket");

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

const io = initializeSocket(server);

app.use("/user", UserRouter);
app.use("/notifications", NotificationRouter);

// app.use(routes);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
