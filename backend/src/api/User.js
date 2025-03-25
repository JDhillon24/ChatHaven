require("dotenv");
const express = require("express");

const router = express.Router();

const { authenticateToken } = require("../utils/auth");

const {
  registerAccount,
  loginUser,
  grantToken,
  logoutUser,
  searchFriends,
  searchUser,
  changeProfilePicture,
  removeFriend,
  updatePassword,
  changeUserName,
  verifyEmail,
} = require("../controllers/UserController");

//route for creating a new user
router.post("/register", registerAccount);

//route for logging in as a user
router.post("/login", loginUser);

//route for creating a new token via refresh
router.post("/token", grantToken);

//route for logging out as a user
router.post("/logout", logoutUser);

//route for searching list of friends
router.get("/friends", authenticateToken, searchFriends);

//route for searching for users
router.get("/search", authenticateToken, searchUser);

//route for changing profile picture
router.put("/profilepicture", authenticateToken, changeProfilePicture);

//route for removing a friend
router.delete("/removefriend", authenticateToken, removeFriend);

//route for updating password
router.put("/updatepassword", authenticateToken, updatePassword);

//route for changing username
router.put("/changeusername", authenticateToken, changeUserName);

//route for verifying email
router.get("/verifyemail", verifyEmail);

module.exports = router;
