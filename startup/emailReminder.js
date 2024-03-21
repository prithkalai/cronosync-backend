const { Agenda } = require("agenda");
const nodemailer = require("nodemailer");
const logger = require("./logger");

// TODO: Setup emailReminder config variables

const emailReminder = new Agenda({
  db: { address: "mongodb://localhost:27017/cronosync" },
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "prithkalai@gmail.com",
    pass: "dzro oudw wybp vwio",
  },
});

emailReminder.define("send email reminder", async (job) => {
  const { email } = job.attrs.data;

  // Include User name, Task Data, User Email
  const mailOptions = {
    from: "prithkalai@gmail.com",
    to: email,
    subject: "Task Reminder From Cronosync",
    text: "Please complete the following task. 'Clean MacBook'",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
});

async function startEmailService() {
  await emailReminder.start();
  throw new Error("FATAL ERROR");
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

module.exports.emailReminder = emailReminder;
module.exports.startEmailService = startEmailService;
module.exports.loadPendingEmailJobs = loadPendingEmailJobs;
