const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    benefits: {
      type: [String],
      default: [],
    },

    guestLimit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);