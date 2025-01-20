require("dotenv");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  //   console.log(authHeader);
  //   const token = authHeader && authHeader.split(" ")[1];

  if (authHeader == null) return res.sendStatus(401);

  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
