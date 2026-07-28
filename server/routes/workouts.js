const express = require("express");
const Workout = require("../models/Workout");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/* GET LOGGED-IN USER WORKOUTS */
router.get("/", authenticate, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json(workouts);
  } catch (err) {
    res.status(500).json({
      error: "Could not load workouts.",
    });
  }
});

/* CREATE WORKOUT */
router.post("/", authenticate, async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({
      error: "Could not save workout.",
    });
  }
});

module.exports = router;