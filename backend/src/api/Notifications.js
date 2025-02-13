require("dotenv");
const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../utils/auth");

const {
  retrieveNotifications,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  sendRoomInvite,
} = require("../controllers/NotificationsController");

//route for retrieving logged in user notifications
router.get("/getall", authenticateToken, retrieveNotifications);

//route for sending a friend request to a user
router.post("/sendfriendrequest", authenticateToken, sendFriendRequest);

//route for accepting a friend request
router.post("/acceptfriendrequest", authenticateToken, acceptFriendRequest);

//route for declining a friend request
router.post("/declinefriendrequest", authenticateToken, declineFriendRequest);

//route for sending a room invite
router.post("roominvite", authenticateToken, sendRoomInvite);

module.exports = router;
