const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const error = require("../middleware/error");
const users = require("../routes/users");
const tasks = require("../routes/tasks");
const login = require("../routes/login");
const category = require("../routes/category");

module.exports = function (app) {
  // Built-in Middleware
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));
  // CORS
  // MORGAN

  // API Routes
  app.use("/api/tasks", tasks);
  app.use("/api/login", login);
  app.use("/api/users", users);
  app.use("/api/category", category);

  // Error Handling Middleware
  app.use(error);
};
