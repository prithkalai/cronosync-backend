const mongoose = require("mongoose");
const joi = require("joi");

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskData: { type: String, required: true },
  interval: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports.Task = Task;

// TODO: Add input validation using joi for Tasks
