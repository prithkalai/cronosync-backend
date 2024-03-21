const express = require("express");
const error = require("../middleware/error");
const users = require("../routes/users");
const tasks = require("../routes/tasks");
const login = require("../routes/login");

module.exports = function (app) {
  // Built-in Middleware
  app.use(express.json());
  // CORS
  // MORGAN

  // API Routes
  app.use("/api/tasks", tasks);
  app.use("/api/login", login);
  app.use("/api/users", users);

  // Error Handling Middleware
  app.use(error);
};
