const express = require("express");
const { User, validateRegister } = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const router = express.Router();

// GET Logged in User Details
router.get("/me", auth, async (req, res) => {
  // Extract info from the user tag(user tag generated by middleware -> auth)
  return res.send({ data: req.user });
  // Return the information of the user
});

// POST New User - SignUp
router.post("/", async (req, res) => {
  // Validate Request Body
  const { error } = validateRegister(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });
  // Check if user is already present
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "User already registered." });
  }

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // Create salted hash of password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;

  // Create a JSON web token
  const token = user.getAuthToken();

  // Save User object to the DB
  await user.save();
  return res.send({
    data: _.pick(user, ["name", "email", "_id"]),
    token: token,
  });
});

module.exports = router;
