const jwt = require("jsonwebtoken");

/* Optional Authentication */
function optionalAuthenticate(req, res, next) {
  /* Get Authorization Header */
  const authHeader = req.headers.authorization;

  /* Check for Bearer Token */
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  /* No Token - Continue as Guest */
  if (!token) {
    req.user = null;
    return next();
  }

  /* Verify Token */
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    /* Invalid or Expired Token */
    if (err) {
      return res.status(403).json({
        error: "Token invalid or expired"
      });
    }

    /* Logged-In User */
    req.user = decoded;

    next();
  });
}

module.exports = optionalAuthenticate;