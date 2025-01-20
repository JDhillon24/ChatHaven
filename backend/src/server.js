require("./config/db");

const app = require("express")();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("express").json;
const urlEncoded = require("express").urlencoded({ extended: false });
const UserRouter = require("./api/User");
// const routes = require("./routes");
app.use(cookieParser());
app.use(bodyParser());
app.use(urlEncoded);

app.use("/user", UserRouter);

app.use(cors());

// app.use(routes);

module.exports = app;
