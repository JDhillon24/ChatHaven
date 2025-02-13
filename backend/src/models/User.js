const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "/images/pfp/default.jpg" },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notifications: [
    {
      type: {
        type: String,
        enum: ["friend_request", "group_invite"],
        required: true,
      },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        default: null,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
