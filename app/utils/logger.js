const { createLogger, format, transports } = require("winston");
const path = require("path");

const logDir = path.join(__dirname, "../logs/error.log");

const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
};

const logger = createLogger({
  levels: customLevels.levels,
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: logDir,
    }),
  ],
});

module.exports = logger;
