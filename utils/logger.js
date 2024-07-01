const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  default: { service: "user-service" },
  transport: [
    new transports.File({ filename: "error.txt", level: "ERROR!!!" }),
    new transports.File({ filename: "combined.txt" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

module.exports = logger;
