const mongoose = require("mongoose");
const joi = require("joi");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
});

const Category = mongoose.model("categories", categorySchema);

// Client input validation for categories
const validateCategory = (body) => {
  const schema = joi.object({
    title: joi.string().required().min(4),
  });

  return schema.validate(body);
};

module.exports.Category = Category;
module.exports.validate = validateCategory;
