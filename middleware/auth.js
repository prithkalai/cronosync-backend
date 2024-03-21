const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res) => {
  // Check if token exists
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(400)
      .send({ message: "Access Denied, No Token Provided" });

  // Validate Token
  try {
    const decoded = jwt.verify(token, config.get("PRIVATE_KEY"));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token...");
  }
};
