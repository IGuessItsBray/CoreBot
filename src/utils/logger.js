const pino = require("pino")
const config = require("../core/config")

const logger = pino({
  level: config.logging.level,
  transport:
    config.bot.environment === "development"
      ? { target: "pino-pretty" }
      : undefined
})

module.exports = logger