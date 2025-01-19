require("./config/db");

const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const UserRouter = require("./api/User");
// const routes = require("./routes");
app.use(bodyParser());

app.use("/user", UserRouter);

app.use(cors());

// app.use(routes);

module.exports = app;
