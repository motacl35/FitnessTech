const express = require("express");
const Membership = require("../models/Membership");

const router = express.Router();

/* GET MEMBERSHIPS */
router.get("/", async (req, res) => {
  try {
    const memberships = await Membership.find();

    res.status(200).json(memberships);
  } catch (err) {
    console.error("Membership loading error:", err);

    res.status(500).json({
      error: "Could not load memberships.",
    });
  }
});

module.exports = router;