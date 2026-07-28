const express = require("express");
const Membership = require("../models/Membership");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let memberships = await Membership.find();

    if (memberships.length === 0) {
      memberships = await Membership.insertMany([
        {
          name: "Basic",
          price: "$19.99/month",
          description:
            "Perfect for members looking for full access to the gym floor and essential equipment.",
          benefits: [
            "Unlimited gym access",
            "Locker room access",
            "Free fitness assessment",
            "Access to cardio and strength equipment",
            "Bring 1 accompanying guest per visit",
          ],
          guestLimit: 1,
        },
        {
          name: "Plus",
          price: "$39.99/month",
          description:
            "Ideal for members who want additional fitness classes and extra guest privileges.",
          benefits: [
            "Everything included in Basic",
            "Unlimited group fitness classes",
            "Priority class reservations",
            "Bring up to 3 accompanying guests per visit",
          ],
          guestLimit: 3,
        },
        {
          name: "Elite",
          price: "$59.99/month",
          description:
            "Our premium membership with access to every amenity Mota's Gym has to offer.",
          benefits: [
            "Everything included in Plus",
            "Sauna access",
            "Personal trainer discount",
            "Priority equipment reservations",
            "Bring up to 5 accompanying guests per visit",
          ],
          guestLimit: 5,
        },
      ]);
    }

    res.status(200).json(memberships);
  } catch (err) {
    res.status(500).json({
      error: "Could not load memberships.",
    });
  }
});

module.exports = router;