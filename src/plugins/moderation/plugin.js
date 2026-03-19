const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "moderation",
  enabled: true,

  /**
   * Initialize the plugin and pull necessary services from the container.
   */
  async init(container) {
    this.container = container;
    this.logger = container.get("logger");
    this.logging = container.get("logging");
  },

  /**
   * Logic to run when the plugin starts.
   * We can add listeners here for "Automod" features later.
   */
  async start() {
    this.logger.info("Moderation plugin started.");
    
    const client = this.container.get("client");

    // Optional: Add a listener for when people try to bypass timeouts
    // (e.g., logging if they leave and rejoin while timed out)
    client.on("guildMemberRemove", async (member) => {
      if (member.communicationDisabledUntilTimestamp > Date.now()) {
        await this.logging.send(member.guild.id, {
          title: "⚠️ Timeout Bypass Attempt",
          color: 0xFEE75C, // Yellow
          content: `${member.user.tag} left the server while they were timed out.`,
          footer: `ID: ${member.id}`
        });
      }
    });
  },

  /**
   * Cleanup listeners on plugin stop/reload.
   */
  async stop() {
    const client = this.container.get("client");
    client.removeAllListeners("guildMemberRemove");
    this.logger.info("Moderation plugin stopped.");
  }
};