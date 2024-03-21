const winston = require("winston");
// require("express-async-errors"); // Removes Try-Catch Blocks in Express Endpoints

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
    }),
    new winston.transports.File({ filename: "logfile.log", level: "warn" }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost/vidly",
    //   level: "error",
    // }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtRejections.log" }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.simple()
  ),
});

module.exports = logger;
