const express = require("express");
const { emailReminder } = require("../startup/emailReminder");
const router = express.Router();

// POST: Add a new Task
router.post("/", async (req, res) => {
  const { email, time } = req.body; // `time` is a human-readable interval, e.g., "in 2 minutes"

  await emailReminder.schedule(time, "send email reminder", { email });
  res.send(`Email to "${email}" scheduled to ${time}.`);
});

module.exports = router;
