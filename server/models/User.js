const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    phone: { type: String, default: "" },
    sex: { type: String, default: "" },
    profilePicture: { type: String, default: "" },

    membershipTier: {
      type: String,
      enum: ["Basic", "Plus", "Elite", ""],
      default: "",
    },

    membershipStatus: {
      type: String,
      enum: ["Active", "Expired", "Suspended"],
      default: "Active",
    },

    memberSince: {
      type: Date,
      default: Date.now,
    },

    paymentMethod: {
      type: {
        type: String,
        enum: ["Credit Card", "Debit Card", ""],
        default: "",
      },

      cardholderName: { type: String, default: "" },
      lastFour: { type: String, default: "" },
      expirationMonth: { type: String, default: "" },
      expirationYear: { type: String, default: "" },
      billingZipCode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);