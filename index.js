const express = require("express");
const config = require("config");
const app = express();
const {
  startEmailService,
  loadPendingEmailJobs,
} = require("./startup/emailReminder");

// API Endpoints
require("./startup/routes")(app);

const ES = config.get("EMAIL");
console.log(ES.KEY);

// Connect to MongoDB
require("./startup/db")();

// Start Email Reminder Service
startEmailService();
loadPendingEmailJobs();

// Server Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
