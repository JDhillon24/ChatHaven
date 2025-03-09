require("dotenv");
const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../utils/auth");

const {
  createRoom,
  getAllRooms,
  leaveRoom,
  messageFriend,
  getRoom,
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

module.exports = router;
