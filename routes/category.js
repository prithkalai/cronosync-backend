const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const {
  Category,
  validate,
  validateDeleteCategory,
} = require("../models/Category");
const { Task } = require("../models/Task");
const router = express.Router();

// GET Categories for a user
router.get("/", auth, async (req, res) => {
  // Extract info from the user tag(user tag generated by middleware -> auth)
  const categories = await Category.find({ userId: req.user._id });
  return res.send({ data: categories });
  // Return the information of the user
});

// POST a New Category
router.post("/", auth, async (req, res) => {
  // Validate Request Body
  const { error } = validate(req.body);

  if (error) return res.status(400).send({ message: error.details[0].message });

  const category = new Category({
    title: req.body.title,
    userId: req.user._id,
  });

  await category.save();
  return res.send({ data: category });
});

router.delete("/:deleteId/:uncategorizedId", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.deleteId)) {
    return res.status(400).send({ message: "Invalid ID format..." });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.uncategorizedId)) {
    return res.status(400).send({ message: "Invalid Task ID format..." });
  }
  // Extract the ID of uncategorized.
  const uncategorized = await Category.findOne({
    userId: req.user._id,
    _id: req.params.uncategorizedId,
  });

  // Find and Update the categories in all the tasks
  await Task.updateMany(
    { userId: req.user._id, "category._id": req.params.deleteId },
    { $set: { category: _.pick(uncategorized, ["_id", "title"]) } }
  );

  // Delete the category from the DB
  const deletedCategory = await Category.findByIdAndDelete({
    userId: req.user._id,
    _id: req.params.deleteId,
  });

  // Return a response to the user
  res.send({ data: deletedCategory });
});

module.exports = router;
