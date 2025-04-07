require("dotenv").config();
const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../utils/auth");

const {
  createRoom,
  getAllRooms,
  leaveRoom,
  messageFriend,
  getRoom,
  changeRoomName,
  inviteNewMembers,
  readAllMessages,
} = require("../controllers/ChatController");

//route for creating a room
router.post("/createroom", authenticateToken, createRoom);

//route for getting all rooms user is a participant of
router.get("/getallrooms", authenticateToken, getAllRooms);

//route for leaving a room
router.delete("/leaveroom/:id", authenticateToken, leaveRoom);

//route for getting room id of private conversation with friend
router.get("/messagefriend/:friendId", authenticateToken, messageFriend);

//route for getting room by id
router.get("/:id", authenticateToken, getRoom);

//route for changing room name
router.put("/changename/:id", authenticateToken, changeRoomName);

//route for inviting new members
router.post("/newinvites/:id", authenticateToken, inviteNewMembers);

//route for reading all messages in a room
router.put("/readall/:id", authenticateToken, readAllMessages);

module.exports = router;
