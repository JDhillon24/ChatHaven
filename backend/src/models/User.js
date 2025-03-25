const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

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
        enum: ["friend_request", "group_invite", "accept_request"],
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
  verified: { type: Boolean, default: false },
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
});

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
