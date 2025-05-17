const mongoose = require('mongoose');
const createLogger = require('./logger');
const logger = createLogger('Database');
const config = require('../../config/configLoader');

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;

  try {
    await mongoose.connect(config.mongoURI, {
      dbName: config.mongoDBName,
    });

    logger.info('✅ Connected to MongoDB via Mongoose');
    return mongoose.connection;
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

function getClient() {
  return mongoose;
}

module.exports = {
  connectToDatabase,
  getClient,
};