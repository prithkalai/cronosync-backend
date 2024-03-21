const express = require("express");

const tasks = require("../routes/tasks");

module.exports = function (app) {
  // Built-in Middleware
  app.use(express.json());

  // API Routes
  app.use("/api/tasks", tasks);
};
