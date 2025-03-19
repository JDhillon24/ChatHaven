require("dotenv");

const { generateAccessToken } = require("../utils/auth");
const { sendNotification } = require("../utils/notificationUtils");

const User = require("./../models/User");
const Chat = require("./../models/Chat");

exports.retrieveNotifications = async (req, res) => {
  try {
    //check if user exists based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email })
      .populate("notifications.sender", "name profilePicture")
      .populate("notifications.room", "name");

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //send list of notifications as response newest first
    res
      .status(200)
      .json(
        user.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    //get sender based on access token info, return error if not found
    const sender = await User.findOne({ email: req.user.email }).select(
      "name profilePicture"
    );
    const { receiverId } = req.body;

    if (!sender)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //validation checks
    if (!receiverId)
      return res
        .status(404)
        .json({ status: "FAILED", message: "Missing receiver Id" });

    if (sender.id === receiverId)
      return res.status(400).json({
        status: "FAIlED",
        message: "You cannot send a friend request to yourself",
      });

    const receiver = await User.findById(receiverId);

    if (!receiver)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //check if they're already friends
    if (receiver.friends.includes(sender.id))
      return res.status(400).json({
        status: "FAILED",
        message: "You are already friends with this user",
      });

    if (
      receiver.notifications.some(
        (noti) =>
          noti.type === "friend_request" && noti.sender.toString() === sender.id
      )
    ) {
      return res.status(400).json({
        status: "FAILED",
        message: "You have already sent a request to this user",
      });
    }

    // console.log(
    //   `is this true?: ${receiver.notifications.some(
    //     (noti) =>
    //       noti.type === "friend_request" && noti.sender.toString() === sender.id
    //   )}`
    // );

    // console.log(receiver.notifications);

    //check if notifications array is undefined, if so initialize empty array
    if (!receiver.notifications) receiver.notifications = [];

    //add notification to receiving user

    const notification = {
      type: "friend_request",
      sender: sender.id,
    };
    receiver.notifications.push(notification);

    await receiver.save();

    //prepare notification for sending through socket
    const socketNotification = {
      type: "friend_request",
      sender: sender,
      room: null,
      createdAt: new Date(Date.now()).toISOString(),
    };

    //notify the user in real time
    sendNotification(receiver.email, socketNotification);

    res.status(200).json({ status: "SUCCESS", message: "Friend request sent" });

    //validation checks
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.acceptFriendRequest = async (req, res) => {
  //get receiving user based on access token info, return error if not found
  const user = await User.findOne({ email: req.user.email });
  const { senderId } = req.body;

  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  //get sending user based on id, return error if not found
  const sender = await User.findById(senderId).select(
    "name email notifications friends profilePicture"
  );

  if (!sender)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  //add each other as friends
  user.friends.push(sender._id);
  sender.friends.push(user._id);

  //send other user a notification that receiving user has accepted the request
  const notification = {
    type: "accept_request",
    sender: user.id,
  };
  sender.notifications.push(notification);

  //remove notification
  user.notifications = user.notifications.filter(
    (noti) =>
      !(noti.type === "friend_request" && noti.sender.toString() === senderId)
  );

  await user.save();
  await sender.save();

  const socketNotification = {
    type: "accept_request",
    sender: user,
    room: null,
    createdAt: new Date(Date.now()).toISOString(),
  };

  sendNotification(sender.email, socketNotification);

  res
    .status(200)
    .json({ status: "SUCCESS", message: "Friend request accepted" });
};

exports.declineFriendRequest = async (req, res) => {
  try {
    //get receiving user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });
    const { senderId } = req.body;

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //remove notification
    user.notifications = user.notifications.filter(
      (noti) =>
        !(noti.type === "friend_request" && noti.sender.toString() === senderId)
    );

    await user.save();

    res
      .status(200)
      .json({ status: "SUCCESS", message: "Friend request declined" });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.sendRoomInvite = async (req, res) => {
  try {
    //get sending user based on access token info, return error if not found
    const sender = await User.findOne({ email: req.user.email });
    const { receiverId, roomId } = req.body;

    if (!sender)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //get receiving user and room based on id, return error if not found
    const receiver = await User.findById(receiverId);
    const room = await Chat.findById(roomId).select("-messages");

    if (!receiver)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    if (!room)
      return res
        .status(404)
        .json({ status: "FAILED", message: "Room not found" });

    //check if receiving user is already in the room
    if (room.participants.includes(receiverId))
      return res.status(400).json({
        status: "FAILED",
        message: "This user is already a participant in this room",
      });

    //check if notifications array is undefined, if so initialize empty array
    if (!receiver.notifications) receiver.notifications = [];

    //sending a notification to the receiving user, and adding them to the room
    receiver.notifications.push({
      type: "group_invite",
      sender: sender.id,
      room: roomId,
    });

    room.participants.push(receiverId);

    await receiver.save();
    await room.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "User has been successfully invited into the room",
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    //get user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //set users notifications to empty array and save to db
    user.notifications = [];
    await user.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Notifications have been successfully cleared",
    });
  } catch (error) {
    res.sendStatus(500);
  }
};
