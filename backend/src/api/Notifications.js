require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("./../models/User");

const { authenticateToken } = require("../utils/auth");

module.exports = router;
