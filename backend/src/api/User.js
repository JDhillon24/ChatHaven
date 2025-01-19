const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./../models/User");

//password handler
const bcrypt = require("bcrypt");

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
          res.json({
            status: "FAILED",
            message: "A user has already been registered with this email!",
          });
        } else {
          //Try to create new user

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
                res.json({
                  status: "SUCCESS",
                  message: "Login successful!",
                  data: data,
                });
              } else {
                res.json({
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
          res.json({
            status: "FAILED",
            message: "Invalid email and/or password!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occurred while searching for user!",
        });
      });
  }
});

module.exports = router;
