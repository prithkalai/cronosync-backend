const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/cronosync")
    .then(() => logger.info("Database connected.."));
};
