const User = require("../models/User");

async function requirePaidMember(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isPaidMember =
      Boolean(user.membershipTier) && user.membershipStatus === "Active";

    if (!isPaidMember) {
      return res.status(403).json({
        error: "An active paid membership is required for this feature.",
      });
    }

    req.memberUser = user;
    next();
  } catch (error) {
    console.error("Paid membership check error:", error);
    res.status(500).json({ error: "Unable to verify membership." });
  }
}

module.exports = requirePaidMember;
