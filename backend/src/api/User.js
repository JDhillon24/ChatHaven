require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const posts = [
  {
    name: "dhillonjagdeep13@gmail.com",
    message: "It works!",
  },
  {
    name: "aklsjdfasdf",
    message: "sdkjgjkjllasdgag",
  },
  {
    name: "aklsjdfkjljasdf",
    message: "sdkjgl'lllasdgag",
  },
];

//mongodb user model
const User = require("./../models/User");

//password handler
const bcrypt = require("bcrypt");
const { authenticateToken, generateAccessToken } = require("../utils/auth");

router.get("/posts", authenticateToken, (req, res) => {
  // console.log(req.user);
  res.json(posts.filter((post) => post.name === req.user.email));
});

//route for creating a new user
router.post("/register", (req, res) => {
  console.log(req.body);
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
    res.json({
      status: "FAILED",
      message: "Empty input field(s)!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: "FAILED",
      message: "Invalid DOB entered",
    });
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    res.json({
      status: "FAILED",
      message: "Invalid password entered!",
    });
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.status(500).json({
            status: "FAILED",
            message: "This email is already in use!",
          });
        } else {
          //Try to create new user

          User.find({ name }).then((result) => {
            if (result.length) {
              res.status(500).json({
                status: "FAILED",
                message: "This username is already taken!",
              });
            } else {
              //password handling
              const saltRounds = 10;
              bcrypt
                .hash(password, saltRounds)
                .then((hashedPassword) => {
                  const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    dateOfBirth,
                  });

                  newUser
                    .save()
                    .then((result) => {
                      res.json({
                        status: "SUCCESS",
                        message: "Registration Successful!",
                        data: result,
                      });
                    })
                    .catch((err) => {
                      console.err(err);
                      res.json({
                        status: "FAILED",
                        message: "An error occurred while saving the user!",
                      });
                    });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occurred while hashing the password!",
                  });
                });
            }
          });
        }
      })
      .catch((err) => {
        console.err(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing users!",
        });
      });
  }
});

//route for logging in as a user
router.post("/login", (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty input field(s)!",
    });
  } else {
    //check if user exists
    User.find({ email })
      .then((data) => {
        if (data.length) {
          //compare body password to hashed password
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                //password matches
                const user = {
                  name: data[0].name,
                  email: data[0].email,
                  profilePicture: data[0].profilePicture,
                };

                const accessToken = generateAccessToken(user);
                const refreshToken = jwt.sign(
                  user,
                  process.env.REFRESH_TOKEN_SECRET
                );
                res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  secure: false,
                });
                res.json({
                  status: "SUCCESS",
                  message: "Login successful!",
                  name: user.name,
                  email: user.email,
                  profilePicture: user.profilePicture,
                  accessToken,
                });
              } else {
                res.status(500).json({
                  status: "FAILED",
                  message: "Invalid email and/or password!",
                });
              }
            })
            .catch((err) => {
              console.err(err);
              res.json({
                status: "FAILED",
                message: "An error occurred while comparing passwords!",
              });
            });
        } else {
          res.status(500).json({
            status: "FAILED",
            message: "Invalid email and/or password!",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          status: "FAILED",
          message: "An error occurred while searching for user!",
        });
      });
  }
});

//route for creating a new token via refresh
router.post("/token", (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
    res.json({
      accessToken,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
  });

  res.sendStatus(204);
});

router.get("/friends", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate(
      "friends"
    );

    if (!user)
      return res
        .status(404)
        .json({ status: "FAILED", message: "User not found" });

    res.json(user.friends);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/search", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.query.name, $options: "i", $ne: req.user.name },
    }).select("name profilePicture");
    res.json(users);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
