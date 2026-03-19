const mongoose = require("mongoose")
const logger = require("../utils/logger")
const config = require("../core/config")

async function connectMongo() {
  await mongoose.connect(config.database.mongoURI)

  logger.info("MongoDB connected")
}

module.exports = { connectMongo }