const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

/* REGISTER USER */
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({
      error: "Username or email already exists.",
    });
  }
});

/* UPDATE PROFILE ONLY */
router.put("/me", authenticate, async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      sex,
      profilePicture,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: "Current password is required.",
        });
      }

      const match = await bcrypt.compare(currentPassword, user.password);

      if (!match) {
        return res.status(401).json({
          error: "Current password is incorrect.",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.address = address;
    user.city = city;
    user.state = state;
    user.zipCode = zipCode;
    user.phone = phone;
    user.email = email;
    user.sex = sex;
    user.profilePicture = profilePicture;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({
      error: "Profile update failed.",
    });
  }
});

/* UPDATE MEMBERSHIP ONLY */
router.put("/me/membership", authenticate, async (req, res) => {
  try {
    const { membershipTier } = req.body;

    const validMemberships = ["Basic", "Plus", "Elite"];

    if (!validMemberships.includes(membershipTier)) {
      return res.status(400).json({
        error: "Invalid membership tier.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { membershipTier },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({
      error: "Membership update failed.",
    });
  }
});

/* UPDATE PAYMENT METHOD ONLY */
router.put("/me/payment", authenticate, async (req, res) => {
  try {
    const {
      paymentMethodType,
      cardholderName,
      cardNumber,
      expirationMonth,
      expirationYear,
      billingZipCode,
    } = req.body;

    if (
      !paymentMethodType ||
      !cardholderName ||
      !cardNumber ||
      !expirationMonth ||
      !expirationYear ||
      !billingZipCode
    ) {
      return res.status(400).json({
        error: "All payment fields are required.",
      });
    }

    const digitsOnly = cardNumber.replace(/\D/g, "");

    if (digitsOnly.length < 12 || digitsOnly.length > 19) {
      return res.status(400).json({
        error: "Invalid card number.",
      });
    }

    const paymentMethod = {
      type: paymentMethodType,
      cardholderName,
      lastFour: digitsOnly.slice(-4),
      expirationMonth,
      expirationYear,
      billingZipCode,
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { paymentMethod },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({
      error: "Payment method update failed.",
    });
  }
});

module.exports = router;