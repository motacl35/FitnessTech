const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: "Email/username and password are required.",
      });
    }

    /* FIND USER BY EMAIL OR USERNAME */
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email/username or password.",
      });
    }

    /* VERIFY PASSWORD */
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        error: "Invalid email/username or password.",
      });
    }

    /* CREATE JWT */
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    /* LOGIN SUCCESS */
    res.status(200).json({
      token,
      username: user.username,
    });
  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      error: "Login failed.",
    });
  }
});

/* GET CURRENT USER */
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Current user error:", err);

    res.status(500).json({
      error: "Could not load user.",
    });
  }
});

module.exports = router;