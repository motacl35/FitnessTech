const express = require("express");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const contact = await ContactMessage.create({ name, email, message });

    res.status(201).json({
      message: "Contact message saved",
      contact,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;