const { Agenda } = require("agenda");
const nodemailer = require("nodemailer");
const logger = require("./logger");
const config = require("config");
const { agendaJobModel } = require("../models/Agenda");

const emailReminder = new Agenda({
  db: { address: "mongodb://localhost:27017/cronosync" },
});

const ES = config.get("EMAIL");

const transporter = nodemailer.createTransport({
  service: ES.SERVICE,
  host: ES.HOST,
  port: 465,
  secure: true,
  auth: {
    user: ES.USER,
    pass: ES.KEY,
  },
});

emailReminder.define("send email reminder", async (job) => {
  const { email, taskData } = job.attrs.data;

  // Include User name, Task Data, User Email
  const mailOptions = {
    from: ES.USER,
    to: email,
    subject: "Task Reminder From Cronosync",
    text: `Please complete the following task. '${taskData}'`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error("Error sending email");
    } else {
      logger.info("Email sent");
    }
  });
});

async function startEmailService() {
  await emailReminder.start();
  logger.info("Email Reminder Service Started!");
}

async function loadPendingEmailJobs() {
  await emailReminder.start();

  // Process overdue and future tasks
  const jobs = await emailReminder.jobs({
    nextRunAt: { $exists: true },
    lastFinishedAt: { $exists: false },
  });
  const currentTime = new Date();
  jobs.forEach((job) => {
    if (job.attrs.nextRunAt < currentTime) {
      // This job is overdue, run it immediately
      job.run();
    } // Future jobs will be picked up by Agenda automatically since startAgenda() has been called
  });
}

async function rescheduleJob(taskId, taskData, email, userId, newEndTime) {
  const job = await agendaJobModel.findOne({
    "data.taskId": taskId,
  });
  if (!job) {
    throw new Error("Requested Job Not Found...");
  }

  // Convert newEndTime to a Date object if it's not already one
  const newRunAtTime = new Date(newEndTime);

  await emailReminder.cancel({ _id: job._id }); // Cancel the existing job

  // Reschedule the job with the new end time
  await emailReminder.schedule(newRunAtTime, "send email reminder", {
    email,
    userId,
    taskId,
    taskData,
  });
  console.log(`Rescheduled job ${taskId} to run at ${newRunAtTime}`);
}

module.exports.emailReminder = emailReminder;
module.exports.startEmailService = startEmailService;
module.exports.loadPendingEmailJobs = loadPendingEmailJobs;
module.exports.rescheduleJob = rescheduleJob;
