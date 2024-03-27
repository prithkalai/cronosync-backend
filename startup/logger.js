const winston = require("winston");
const config = require("config");
require("express-async-errors"); // Removes Try-Catch Blocks in Express Endpoints

if (!config.get("PRIVATE_KEY")) {
  throw new Error("FATAL ERROR: Server PRIVATE_KEY not defined");
}

if (!config.get("EMAIL")) {
  throw new Error("FATAL ERROR: Email Service credentials not defined");
}

if (!config.get("DB_AUTH")) {
  throw new Error("FATAL ERROR: DB_AUTH not defined");
}

if (!config.get("DB_USER")) {
  throw new Error("FATAL ERROR: DB_USER not defined");
}

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
