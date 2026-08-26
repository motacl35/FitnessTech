const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

const router = express.Router();


/* REGISTER USER */

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    /* Validate Required Fields */
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required.",
      });
    }

    /* Check Username */
    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        error: "Username already exists.",
      });
    }

    /* Check Email */
    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        error: "Email already exists.",
      });
    }

    /* Hash Password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* Create Free Account */
    const user = await User.create({
      username,
      email,
      password: hashedPassword,

      /* New accounts start without a paid membership */
      membershipTier: "",
      membershipStatus: "Inactive",
    });

    /* Create JWT */
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

    /* Return Login Information */
    return res.status(201).json({
      message: "Account created successfully.",

      token,

      username: user.username,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        membershipTier: user.membershipTier,
        membershipStatus: user.membershipStatus,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    return res.status(500).json({
      error: "Registration failed.",
    });
  }
});


/* UPDATE PROFILE */

router.put("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

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


    /* CHECK USERNAME */

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        username,
        _id: {
          $ne: user._id,
        },
      });

      if (existingUsername) {
        return res.status(400).json({
          error: "Username already exists.",
        });
      }

      user.username = username;
    }


    /* CHECK EMAIL */

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        email,
        _id: {
          $ne: user._id,
        },
      });

      if (existingEmail) {
        return res.status(400).json({
          error: "Email already exists.",
        });
      }

      user.email = email;
    }


    /* UPDATE PROFILE INFORMATION */

    if (firstName !== undefined) {
      user.firstName = firstName;
    }

    if (lastName !== undefined) {
      user.lastName = lastName;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (city !== undefined) {
      user.city = city;
    }

    if (state !== undefined) {
      user.state = state;
    }

    if (zipCode !== undefined) {
      user.zipCode = zipCode;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (sex !== undefined) {
      user.sex = sex;
    }

    if (profilePicture !== undefined) {
      user.profilePicture = profilePicture;
    }


    /* CHANGE PASSWORD */

    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword) {
        return res.status(400).json({
          error: "Current password is required.",
        });
      }

      const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatches) {
        return res.status(400).json({
          error: "Current password is incorrect.",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }


    /* SAVE USER */

    await user.save();


    /* RETURN USER WITHOUT PASSWORD */

    const updatedUser = await User.findById(user._id).select(
      "-password"
    );

    return res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);

    return res.status(500).json({
      error: "Profile update failed.",
    });
  }
});


/* UPDATE MEMBERSHIP */

router.put(
  "/me/membership",
  authenticate,
  async (req, res) => {
    try {
      const { membershipTier } = req.body;

      const validMemberships = [
        "Basic",
        "Plus",
        "Elite",
      ];

      /* Validate Membership */
      if (!validMemberships.includes(membershipTier)) {
        return res.status(400).json({
          error: "Invalid membership tier.",
        });
      }


      /* Find User */
      const user = await User.findById(
        req.user.userId
      );

      if (!user) {
        return res.status(404).json({
          error: "User not found.",
        });
      }


      /* Update Membership */
      user.membershipTier = membershipTier;
      user.membershipStatus = "Active";


      /*
        Only set memberSince the first time
        the user becomes a member.
      */
      if (!user.memberSince) {
        user.memberSince = new Date();
      }


      await user.save();


      /* Return Updated User */
      const updatedUser = await User.findById(
        user._id
      ).select("-password");

      return res.json(updatedUser);
    } catch (err) {
      console.error(
        "Membership update error:",
        err
      );

      return res.status(500).json({
        error: "Membership update failed.",
      });
    }
  }
);


/* UPDATE PAYMENT METHOD */

router.put(
  "/me/payment",
  authenticate,
  async (req, res) => {
    try {
      const {
        paymentMethodType,
        cardholderName,
        cardNumber,
        expirationMonth,
        expirationYear,
        billingZipCode,
      } = req.body;


      /* Validate Required Fields */
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


      /* Remove Spaces And Non-Numeric Characters */
      const digitsOnly = cardNumber.replace(
        /\D/g,
        ""
      );


      /* Validate Card Length */
      if (
        digitsOnly.length < 12 ||
        digitsOnly.length > 19
      ) {
        return res.status(400).json({
          error: "Invalid card number.",
        });
      }


      /* Only Store Last Four Digits */
      const paymentMethod = {
        type: paymentMethodType,
        cardholderName,
        lastFour: digitsOnly.slice(-4),
        expirationMonth,
        expirationYear,
        billingZipCode,
      };


      /* Find User */
      const user = await User.findById(
        req.user.userId
      );

      if (!user) {
        return res.status(404).json({
          error: "User not found.",
        });
      }


      /* Save Payment Method */
      user.paymentMethod = paymentMethod;

      await user.save();


      /* Return Updated User */
      const updatedUser = await User.findById(
        user._id
      ).select("-password");

      return res.json(updatedUser);
    } catch (err) {
      console.error(
        "Payment update error:",
        err
      );

      return res.status(500).json({
        error: "Payment method update failed.",
      });
    }
  }
);


/* EXPORT ROUTER */

module.exports = router;