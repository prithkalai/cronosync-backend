const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("config");

module.exports = function () {
  const DB_USER = config.get("DB_USER");
  const DB_AUTH = config.get("DB_AUTH");

  mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_AUTH}@cronosync-cluster.fmbrfyn.mongodb.net/cronosync?retryWrites=true&w=majority&appName=CronoSync-Cluster`
    )
    .then(() => logger.info("Database connected.."));
};
