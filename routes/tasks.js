const express = require("express");
const { emailReminder, rescheduleJob } = require("../startup/emailReminder");
const auth = require("../middleware/auth");
const { Task, validate } = require("../models/Task");
const humanInterval = require("human-interval");
const router = express.Router();

// GET: Get the list of tasks for a user
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id });
  res.send({ data: tasks });
});

// POST: Add a new Task
router.post("/", auth, async (req, res) => {
  // Validate Request Body
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  // Gather Required Data for Agenda and Task Creation
  const email = req.user.email;
  const userId = req.user._id;
  const taskData = req.body.taskData;
  const duration = humanInterval(req.body.interval);
  if (duration === undefined) {
    return res.status(400).send({ message: "Invalid interval provided." });
  }
  const currentTime = new Date();
  const endTime = new Date(currentTime.getTime() + duration);

  const task = new Task({
    userId: userId,
    taskData: taskData,
    interval: req.body.interval,
    startTime: currentTime,
    endTime: endTime,
  });

  const taskId = task._id.toString();

  await task.save();

  await emailReminder.schedule(endTime, "send email reminder", {
    email,
    userId,
    taskId,
    taskData,
  });
  res.send({ data: task });
});

// TODO: Include a boolean if user wants to update the start time as well, or retain the old start time
// One Idea: Give user the option to extend or shorten the current duration.
// PUT: Update a Task

// By default this updates the duration based on the startTime
router.put("/:id", auth, async (req, res) => {
  // Request Body Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  // Check if tasks exists
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).send({ message: "Requested Task Not Found..." });
  }

  // Update Tasks Data Regardless
  task.taskData = req.body.taskData;

  // Interval Updates
  if (req.body.interval !== task.interval) {
    // Gather required Data for Agenda and Task Creation
    const duration = humanInterval(req.body.interval);
    if (duration === undefined) {
      return res.status(400).send({ message: "Invalid interval provided." });
    }

    const email = req.user.email;
    const userId = req.user._id;
    const startTime = task.startTime;
    // Update based on startTime
    const endTime = new Date(startTime.getTime() + duration);

    if (endTime < new Date()) {
      return res.status(400).send({
        message: "Updated Duration is lesser than the completed duration",
      });
    }
    const taskId = task._id.toString();

    // Update Task
    task.interval = req.body.interval;
    task.endTime = endTime;

    // Reschedule Task Agenda
    await rescheduleJob(taskId, task.taskData, email, userId, endTime);
  }

  // Save Task
  await task.save();
  return res.send({ data: task });
});

module.exports = router;
