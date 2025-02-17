require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/auth");

const User = require("./../models/User");

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
    const existingUsername = await User.findOne({ name });
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
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
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
      sameSite: "strict",
    });

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

exports.grantToken = (req, res) => {
  // get refresh token from cookies, return if not found
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  //verify refresh token and grant new access token if successful
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
    res.status(200).json({
      accessToken,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  });
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
      "friends"
    );

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    //filter friends list based on search query if not empty
    if (req.query.name !== "") {
      const friends = user.friends.filter((friend) =>
        friend.name.includes(req.query.name)
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

    //filter out users that are in the logged in users friends list or users that have already received a friend request and return filtered list
    const filteredUsers = users.filter(
      (x) =>
        !user.friends.includes(x.id) &&
        !(
          x.notifications &&
          x.notifications.some(
            (noti) => noti.type === "friend_request" && noti.sender === user.id
          )
        )
    );
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.changeProfilePicture = async (req, res) => {
  try {
    //finding user based on access token info and updating profile picture
    const result = await User.updateOne(
      { email: req.user.email },
      { profilePicture: req.profilePicture }
    );

    //return error if cant find user or fail to update picture
    if (result.modifiedCount === 0)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });
  } catch (error) {
    res.sendStatus(500);
  }
};
