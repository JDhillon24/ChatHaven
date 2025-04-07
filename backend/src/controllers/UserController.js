require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateVerificationToken,
} = require("../utils/auth");

const User = require("./../models/User");
const sendEmail = require("../email/emailService");
const crypto = require("crypto");

exports.registerAccount = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    // Validation Checks
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Empty input field(s)!" });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Invalid email entered" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      return res.status(400).json({
        status: "FAILED",
        message:
          "Invalid password! Must include uppercase, lowercase, number, and symbol.",
      });
    }

    // Check if Email Already Exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ status: "FAILED", message: "This email is already in use!" });
    }

    // Check if Username is Taken
    const existingUsername = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingUsername) {
      return res.status(409).json({
        status: "FAILED",
        message: "This username is already taken!",
      });
    }

    // Hash the Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and Save New User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const verificationToken = generateVerificationToken(savedUser.id);

    sendEmail(email, "Verify Your Account | ChatHaven", "verifyEmail", {
      name,
      verificationLink: `https://www.chathaven.com/Verify?token=${verificationToken}&email=${encodeURIComponent(
        email
      )}`,
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "Registration Successful!",
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred during registration.",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Empty input field(s)!" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid email and/or password!",
      });
    }

    //check if user has verified their email
    if (!user.verified) {
      return res.status(401).json({
        status: "FAILED",
        message: "User has not been verified yet",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "FAILED",
        message: "Invalid email and/or password!",
      });
    }

    // Generate access & refresh tokens
    const userPayload = {
      // name: user.name,
      email: user.email,
      // profilePicture: user.profilePicture,
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = jwt.sign(
      userPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "lax",
    });

    // sendEmail("dhillonjagdeep13@gmail.com", "test email", "verifyEmail", {
    //   name: "Jagdeep Dhillon",
    //   verificationLink: "https://www.youtube.com",
    // });

    // Send response
    res.status(200).json({
      status: "SUCCESS",
      message: "Login successful!",
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ status: "FAILED", message: "An error occurred during login!" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    //get user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    const { currentPassword, newPassword, confirmPassword } = req.body;

    //check if inputted password matches with db
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Current password is incorrect" });
    }

    //check if new password is "strong"
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    ) {
      return res.status(400).json({
        status: "FAILED",
        message:
          "Invalid password! Must include uppercase, lowercase, number, and symbol.",
      });
    }

    //check if new password and confirmation match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "FAILED",
        message: "Password do not match",
      });
    }

    //hash new password and save to db
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Password has been successfully updated!",
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.changeUserName = async (req, res) => {
  try {
    //get user based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    const { newName } = req.body;

    //check if username is taken
    const existingUsername = await User.findOne({
      name: { $regex: new RegExp(`^${newName.trim()}$`, "i") },
    });
    if (existingUsername) {
      return res.status(409).json({
        status: "FAILED",
        message: "Username is already taken",
      });
    }

    //set user's name to new name and save to db
    user.name = newName.trim();
    await user.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Username has been successfully changed",
    });
  } catch (error) {}
};

exports.grantToken = (req, res) => {
  // get refresh token from cookies, return if not found
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  //verify refresh token and grant new access token if successful
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.sendStatus(403);

      const loggedInUser = await User.findOne({ email: user.email });

      if (!loggedInUser)
        return res
          .status(404)
          .json({ status: "FAILED", message: "User not found" });

      const accessToken = generateAccessToken({
        name: loggedInUser.name,
        email: user.email,
        profilePicture: loggedInUser.profilePicture,
      });
      res.status(200).json({
        accessToken,
        name: loggedInUser.name,
        email: user.email,
        profilePicture: loggedInUser.profilePicture,
      });
    }
  );
};

exports.logoutUser = (req, res) => {
  //clear refresh token cookie and send status
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
  });
  res.sendStatus(204);
};

// exports.retrieveFriends = async (req, res) => {
//   try {
//     //check if user exists based on access token info, return error if not found
//     const user = await User.findOne({ email: req.user.email }).populate(
//       "friends"
//     );

//     if (!user)
//       return res
//         .status(404)
//         .json({ status: "FAILED", message: "User not found" });

//     //send list of friends as response
//     res.status(200).json(user.friends);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// };

exports.searchFriends = async (req, res) => {
  try {
    //check if user exists based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email }).populate(
      "friends",
      "name profilePicture"
    );

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //filter friends list based on search query if not empty
    if (req.query.name !== "" && req.query.name) {
      const friends = user.friends.filter((friend) =>
        friend.name.toLowerCase().includes(req.query.name.toLowerCase())
      );

      res.status(200).json(friends);
    } else {
      res.status(200).json(user.friends);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

//searches for users excluding the logged in user and users who have been sent a request and/or are already friends, sends response containing results
exports.searchUser = async (req, res) => {
  try {
    //check if user exists based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    if (req.query.name === "") {
      return res.status(200).json([]);
    }

    const users = await User.find({
      name: { $regex: req.query.name, $options: "i", $ne: req.user.name },
    }).select("name profilePicture");

    //filter out users that are in the logged in users friends list and return filtered list
    const filteredUsers = users.filter((x) => !user.friends.includes(x.id));
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.sendStatus(500);
  }
};

//function to remove friend from list
exports.removeFriend = async (req, res) => {
  try {
    //check if user exists based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    const { friendId } = req.query;

    //find former friend by id and check if exists
    const friend = await User.findById(friendId);

    if (!friend)
      return res
        .status(404)
        .json({ status: "FAILED", message: "Friend not found" });

    if (!user.friends.includes(friend.id))
      return res.status(404).json({
        status: "FAILED",
        message: "You are not friends with this user",
      });

    //filter out each other from friends lists
    user.friends = user.friends.filter((fr) => fr.toString() !== friend.id);
    friend.friends = friend.friends.filter((fr) => fr.toString() !== user.id);
    // console.log(user.friends[0].toString());
    // console.log(friend.id);

    await user.save();
    await friend.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully removed this friend!",
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.changeProfilePicture = async (req, res) => {
  try {
    //check if user exists based on access token info, return error if not found
    const user = await User.findOne({ email: req.user.email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //finding user based on access token info and updating profile picture
    const result = await User.updateOne(
      { _id: user.id },
      { $set: { profilePicture: req.body.profilePicture } }
    );

    //return error if cant find user or fail to update picture
    if (result.modifiedCount === 0 || result.acknowledged === false)
      return res
        .status(400)
        .json({ status: "FAILED", message: "Failed to update profile" });

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    //verify jwt token if it matches with user then update user
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { verified: true });
    res.status(200).json({
      status: "SUCCESS",
      message: "User has been verified successfully!",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "FAILED", message: "Invalid or expired token" });
  }
};

exports.resendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;

    //get user via email and validate them
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    if (user.verified)
      return res
        .status(400)
        .json({ status: "FAILED", message: "User is already verified" });

    //create a new token and send email with said token
    const verificationToken = generateVerificationToken(user.id);

    sendEmail(email, "Verify Your Account | ChatHaven", "verifyEmail", {
      name: user.name,
      verificationLink: `https://www.chathaven.com/Verify?token=${verificationToken}&email=${encodeURIComponent(
        email
      )}`,
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.forgotPassword = async (req, res) => {
  //get user based on email in req body
  let { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  //generate password reset token and save to db
  const resetToken = user.createResetPasswordToken();
  await user.save();

  //send email with token to user
  try {
    sendEmail(email, "Reset Password | ChatHaven", "forgotPassword", {
      forgotPasswordLink: `https://www.chathaven.com/ResetPassword?token=${resetToken}`,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "A password reset link has been successfully sent!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires;
    await user.save();

    return res
      .status(500)
      .json({ status: "FAILED", message: "Email failed to send" });
  }
};

exports.resetPassword = async (req, res) => {
  //find user based on given token, check if token is expired
  let { token } = req.params;
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(404).json({
      status: "FAILED",
      message: "User not found or token is expired",
    });
  else
    return res
      .status(404)
      .json({ status: "TEST", message: "DATE causing problems" });

  let { newPassword, confirmPassword } = req.body;

  //check if new password is "strong"
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      newPassword
    )
  ) {
    return res.status(400).json({
      status: "FAILED",
      message:
        "Invalid password! Must include uppercase, lowercase, number, and symbol.",
    });
  }

  //check if new password and confirmation match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "FAILED",
      message: "Password do not match",
    });
  }

  //hash new password and save to db
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "SUCCESS",
    message: "Password has been successfully reset!",
  });
};
