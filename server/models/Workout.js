const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutDate: {
      type: String,
      required: true,
    },

    workoutType: {
      type: String,
      required: true,
    },

    exercisePerformed: {
      type: String,
      required: true,
    },

    duration: String,
    caloriesBurned: String,
    averageHeartRate: String,
    maximumHeartRate: String,
    sets: String,
    repetitions: String,
    weightLifted: String,
    distance: String,
    bodyWeight: String,
    waterIntake: String,
    sleepHours: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);