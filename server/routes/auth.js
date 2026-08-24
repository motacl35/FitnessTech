const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

module.exports = router;