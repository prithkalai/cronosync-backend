const mongoose = require("mongoose");
const joi = require("joi");

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  taskData: { type: String, required: true },
  interval: { type: String, required: true },
  startTime: { type: Date, default: new Date() },
  endTime: { type: Date, required: true },
  category: {
    type: String,
    default: "None",
  },
});

const Task = mongoose.model("tasks", taskSchema);

// Client input validation for tasks
const validateTasks = (body) => {
  const schema = joi.object({
    taskData: joi.string().required(),
    interval: joi.string().required(),
  });

  return schema.validate(body);
};

module.exports.Task = Task;
module.exports.validate = validateTasks;
