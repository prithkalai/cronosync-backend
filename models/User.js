const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

// Function to create json web tokens
userSchema.methods.getAuthToken = function () {
  const token = jwt.sign(
    {
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      _id: this._id,
    },
    config.get("PRIVATE_KEY")
  );
  return token;
};

const User = mongoose.model("users", userSchema);

// Input validation from client
const validateUser = (body) => {
  const schema = joi.object({
    name: joi.string().required().min(4).max(50),
    email: joi.string().email().required(),
    password: joi.string().required().min(4),
  });
  return schema.validate(body);
};

const validateLogin = (body) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(4),
  });
  return schema.validate(body);
};

module.exports.User = User;
module.exports.validateRegister = validateUser;
module.exports.validateLogin = validateLogin;
