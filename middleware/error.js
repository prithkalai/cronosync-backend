const logger = require("../startup/logger");
module.exports = function (err, req, res) {
  logger.log("error", "Internal Server Error", err);
  res.status(500).send({ message: "Internal Server Error" });
};
