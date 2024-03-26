const { Agenda } = require("agenda");
const nodemailer = require("nodemailer");
const logger = require("./logger");
const config = require("config");
const { agendaJobModel } = require("../models/Agenda");

const emailReminder = new Agenda({
  db: { address: "mongodb://localhost/cronosync" },
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
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Reminder From CronoSync</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 20px auto;
        }
        .header {
            font-size: 24px;
            color: #333;
        }
        .content {
            margin-top: 20px;
            font-size: 16px;
            color: #666;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Task Reminder</div>
        <div class="content">
            <p>Hi there,</p>
            <p>Just a friendly reminder that you have a task that needs to be completed.</p>
            <!-- Dynamic content goes here -->
            <p>Task: <strong>${taskData}</strong></p>
            <!-- End of dynamic content -->
            <p>Please reset it so we can remind you again!</p>
            <p>Happy Scheduling!!</p>
        </div>
        <div class="footer">
            © [2024] CronoSync | <a href="https://yourwebsite.com">Website</a>
        </div>
    </div>
</body>
</html>
`,
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
  logger.info(`Rescheduled job ${taskId} to run at ${newRunAtTime}`);
}

async function deleteJob(taskId) {
  const job = await agendaJobModel.findOne({ "data.taskId": taskId });
  if (!job) {
    throw new Error("Requested Job Not Found...");
  }
  await emailReminder.cancel({ _id: job._id });
  await agendaJobModel.deleteOne({ _id: job._id });
  logger.info(`Deleted Job ${job._id}`);
}

module.exports.emailReminder = emailReminder;
module.exports.startEmailService = startEmailService;
module.exports.loadPendingEmailJobs = loadPendingEmailJobs;
module.exports.rescheduleJob = rescheduleJob;
module.exports.deleteJob = deleteJob;
