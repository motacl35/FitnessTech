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
    heightFeet: { type: Number,min: 3, max: 8,default: null,},

heightInches: {type: Number, min: 0, max: 11, default: null,},

weight: {type: Number, min: 60, max: 700,default: null,},

bmi: {
  type: Number,
  default: null,
},
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