const express = require("express");
const morgan = require("morgan");
const app = express();
const {
  startEmailService,
  loadPendingEmailJobs,
} = require("./startup/emailReminder");

// API Endpoints
require("./startup/routes")(app);

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
