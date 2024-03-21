const express = require("express");
const { validateLogin, User } = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateLogin();
  if (error) return res.status(400).send({ data: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "Invalid Username or Password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or Password");

  const token = user.getAuthToken();

  res.send({ message: "User Logged in successfully", token: token });
});

module.exports = router;
