const mongoose = require("mongoose");

class DatabaseService {
  constructor(container) {
    this.container = container;
    // Pull the already-loaded config from the container
    this.config = container.get("config");
    this.logger = container.get("logger");
    this.db = null;
  }

  async init() {
    // Matches your config.json: "database": { "mongoURI": "..." }
    const uri = this.config.database?.mongoURI;

    if (!uri) {
      this.logger.error("❌ DatabaseService: No mongoURI found in config.json under 'database'");
      throw new Error("Missing MongoDB Connection URI");
    }

    try {
      this.logger.info("Connecting to MongoDB...");
      
      this.db = await mongoose.connect(uri, {
        autoIndex: true,
      });

      this.logger.info("✅ DatabaseService: Connected to MongoDB.");

      mongoose.connection.on("error", (err) => {
        this.logger.error(err, "MongoDB connection error");
      });

      mongoose.connection.on("disconnected", () => {
        this.logger.warn("MongoDB disconnected.");
      });

    } catch (err) {
      this.logger.error(err, "❌ DatabaseService: Failed to connect to MongoDB");
      throw err; 
    }
  }

  async stop() {
    if (this.db) {
      await mongoose.disconnect();
      this.logger.info("DatabaseService: Disconnected from MongoDB.");
    }
  }
}

module.exports = DatabaseService;