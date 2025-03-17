require("dotenv");

const { sendNotification } = require("../utils/notificationUtils");

const User = require("./../models/User");
const Chat = require("./../models/Chat");
const { default: mongoose } = require("mongoose");

exports.createRoom = async (req, res) => {
  try {
    //get user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    let { name, participants } = req.body;

    //validation checks
    if (!name)
      return res
        .status(400)
        .json({ status: "FAILED", message: "A room name is required" });

    if (!participants)
      return res.status(400).json({
        status: "FAILED",
        message: "A list of participants is required",
      });

    //check if each participant is a user
    for (const participant of participants) {
      const participantUser = await User.findById(participant);
      if (!participantUser)
        return res.status(404).json({
          status: "FAILED",
          message: "One or more participants is not an existing user",
        });
    }

    // console.log(user.id);

    //create a new room

    const newRoom = new Chat({
      name,
      isGroup: true,
      participants,
      messages: [],
    });

    newRoom.participants.push(user._id);

    //save to db
    const savedRoom = await newRoom.save();

    //send out a notification to each participant except for user who created the room
    for (const participant of participants) {
      const participantUser = await User.findById(participant);

      if (participantUser.id !== user.id) {
        const notification = {
          type: "group_invite",
          sender: user.id,
          room: savedRoom.id,
        };

        participantUser.notifications.push(notification);

        const socketNotification = {
          type: "group_invite",
          sender: user,
          room: savedRoom,
          createdAt: new Date(Date.now()).toISOString(),
        };

        sendNotification(participantUser.email, socketNotification);
        await participantUser.save();
      }
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Room has been successfully created",
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    //get user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    let { search } = req.query;

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //find all rooms where user is a participant and return a response
    if (search && search !== "") {
      const rooms = await Chat.find(
        {
          $or: [
            { isGroup: true, name: { $regex: search, $options: "i" } },
            { isGroup: false },
          ],
          participants: { $in: [user.id] },
        },
        { name: 1, participants: 1, isGroup: 1, messages: { $slice: -1 } }
      ).populate("participants", "name profilePicture");

      const filteredRooms = rooms.filter(
        (room) =>
          room.isGroup ||
          room.participants.some((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
      );

      res.status(200).json(filteredRooms);
    } else {
      const rooms = await Chat.find(
        {
          participants: { $in: [user.id] },
        },
        { name: 1, participants: 1, isGroup: 1, messages: { $slice: -1 } }
      ).populate("participants", "name profilePicture");

      res.status(200).json(rooms);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.getRoom = async (req, res) => {
  try {
    try {
      //get user based on access token info, return error if not found
      const user = await User.findOne({ email: req.user.email });

      if (!user)
        return res
          .status(404)
          .json({ status: "FAILED", message: "User not found" });

      let { id } = req.params;

      const room = await Chat.findById(id).populate(
        "participants",
        "name profilePicture"
      );

      if (
        !room.participants.some(
          (participant) => participant._id.toString() === user.id
        )
      )
        return res.status(400).json({
          status: "FAILED",
          message: "You are not a participant of this room",
        });

      res.status(200).json(room);
    } catch (error) {}
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    //get user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //get room by id and validate it
    let { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ status: "FAILED", message: "A room Id is required" });

    const room = await Chat.findById(id);
    if (!room)
      return res
        .status(404)
        .json({ status: "FAILED", message: "Room not found" });

    //remove user from room and save to db
    room.participants = room.participants.filter(
      (participant) => participant.toString() !== user.id
    );

    await room.save();

    if (room.participants.length === 0) {
      await room.deleteOne();
      res.status(200).json({
        status: "SUCCESS",
        message: "Room has been deleted as no participants are remaining",
      });
    } else {
      res.status(200).json({
        status: "SUCCESS",
        message: "User has successfully left the room",
      });
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.messageFriend = async (req, res) => {
  //get user based on access token info, return error if not found
  const user = await User.findOne({ email: req.user.email });

  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  let { friendId } = req.params;

  //check if friend is an existing user
  const friend = await User.findById(friendId);

  if (!friend)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  //find room where both users are a participant and isGroup is equal to false and return the id
  const room = await Chat.findOne({
    isGroup: false,
    participants: { $in: [user.id, friend.id] },
  });

  if (room) {
    res.status(200).json({ id: room.id });
  } else {
    //if the room doesnt exist create a new room and return the id
    const newRoom = new Chat({
      isGroup: false,
      participants: [user.id, friend.id],
      messages: [],
    });

    const savedRoom = await newRoom.save();

    res.status(200).json({ id: savedRoom.id });
  }
};

exports.changeRoomName = async (req, res) => {
  //get user based on access token info, return error if not found
  const user = await User.findOne({ email: req.user.email });

  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  //get room by id and validate it
  let { id } = req.params;
  let { newName } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ status: "FAILED", message: "A room Id is required" });

  if (!newName)
    return res
      .status(400)
      .json({ status: "FAILED", message: "A new name is required" });

  const room = await Chat.findById(id);
  if (!room)
    return res
      .status(404)
      .json({ status: "FAILED", message: "Room not found" });

  //check if user changing name is participant of the room
  if (
    !room.participants.some(
      (participant) => participant._id.toString() === user.id
    )
  )
    return res.status(400).json({
      status: "FAILED",
      message: "You are not a participant of this room",
    });

  //update room name and save to db
  room.name = newName;

  //if room isnt a group set it to one
  if (!room.isGroup) room.isGroup = true;
  await room.save();

  res.status(200).json({
    status: "SUCCESS",
    message: "Room name has been successfully changed!",
  });
};

exports.inviteNewMembers = async (req, res) => {
  //get user based on access token info, return error if not found
  const user = await User.findOne({ email: req.user.email });

  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  let { participants } = req.body;

  if (!participants)
    return res.status(400).json({
      status: "FAILED",
      message: "A list of participants is required",
    });

  let { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ status: "FAILED", message: "A room Id is required" });

  const room = await Chat.findById(id)
    .select("-messages")
    .populate("participants", "name profilePicture");
  if (!room)
    return res
      .status(404)
      .json({ status: "FAILED", message: "Room not found" });

  //validate participants
  for (const participant of participants) {
    const participantUser = await User.findById(participant);
    if (!participantUser)
      return res.status(404).json({
        status: "FAILED",
        message: "One or more participants is not an existing user",
      });

    if (room.participants.some((p) => p._id.toString() === participantUser.id))
      return res.status(400).json({
        status: "FAILED",
        message: "One or more participants are already in this room",
      });
  }

  room.participants.push(...participants);

  //if room isnt a group, update it and set room name to combination of participant names
  if (!room.isGroup) {
    room.isGroup = true;
    room.name = room.participants.map((p) => p.name).join(", ");
  }

  //send out a notification to each participant except for user who created the room
  for (const participant of participants) {
    const participantUser = await User.findById(participant);

    if (participantUser.id !== user.id) {
      const notification = {
        type: "group_invite",
        sender: user.id,
        room: room.id,
      };

      participantUser.notifications.push(notification);

      const socketNotification = {
        type: "group_invite",
        sender: user,
        room: room,
        createdAt: new Date(Date.now()).toISOString(),
      };

      sendNotification(participantUser.email, socketNotification);
      await participantUser.save();
    }
  }

  await room.save();

  res.status(200).json({
    status: "SUCCESS",
    message: "The selected members have been added to the room",
  });
};
