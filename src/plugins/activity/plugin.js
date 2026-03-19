const User = require("../../models/User");

module.exports = {
  name: "activity",
  enabled: true,

  /**
   * Initialize the plugin and pull necessary services.
   */
  async init(container) {
    this.container = container;
    this.logger = container.get("logger");
  },

  /**
   * Logic to run when the plugin starts.
   * Listens for all messages to track engagement metrics.
   */
  async start() {
    const client = this.container.get("client");

    client.on("messageCreate", async (message) => {
      // 1. Safety Checks: Ignore bots, system messages, and DMs
      if (message.author.bot || !message.guild || message.system) return;

      try {
        const guildId = message.guild.id;
        const userId = message.author.id;
        const charCount = message.content.length;

        /**
         * 2. Atomic Database Update
         * $inc: Increments numeric values (messageCount +1, characterCount +length)
         * $set: Overwrites values (lastSeen timestamp, current username)
         * upsert: true - Creates the document if it doesn't exist yet
         */
        await User.findOneAndUpdate(
          { 
            guildId: guildId, 
            userId: userId 
          },
          { 
            $inc: { 
              messageCount: 1,
              characterCount: charCount 
            },
            $set: { 
              lastSeen: new Date(),
              username: message.author.tag 
            }
          },
          { upsert: true, new: true }
        );

      } catch (err) {
        // Log the error but don't crash the bot on a failed activity log
        this.logger.error(err, `Activity Plugin: Failed to log message for ${message.author.id}`);
      }
    });

    this.logger.info("Activity tracking system initialized (Messages + Characters).");
  },

  /**
   * Cleanup listeners on plugin stop/reload.
   */
  async stop() {
    const client = this.container.get("client");
    client.removeAllListeners("messageCreate");
    this.logger.info("Activity tracking system stopped.");
  }
};