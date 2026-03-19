const Guild = require("../../models/Guild");

module.exports = {
  name: "notifications",
  enabled: true,

  async init(container) {
    this.container = container;
    this.logger = container.get("logger");
  },

  async start() {
    const client = this.container.get("client");

    // Helper to replace variables
    const parse = (str, member) => {
      return str
        .replace(/\${user}/g, member.toString())
        .replace(/\${guild}/g, member.guild.name);
    };

    // --- JOIN HANDLER ---
    client.on("guildMemberAdd", async (member) => {
      try {
        const data = await Guild.findOne({ guildId: member.guild.id });
        if (!data?.welcome?.enabled || !data.welcome.channelId) return;

        const channel = member.guild.channels.cache.get(data.welcome.channelId);
        if (channel) {
          await channel.send(parse(data.welcome.message, member));
        }
      } catch (err) {
        this.logger.error(err, "Notifications: Join alert failed.");
      }
    });

    // --- LEAVE HANDLER ---
    client.on("guildMemberRemove", async (member) => {
      try {
        const data = await Guild.findOne({ guildId: member.guild.id });
        if (!data?.leave?.enabled || !data.leave.channelId) return;

        const channel = member.guild.channels.cache.get(data.leave.channelId);
        if (channel) {
          await channel.send(parse(data.leave.message, member));
        }
      } catch (err) {
        this.logger.error(err, "Notifications: Leave alert failed.");
      }
    });
  },

  async stop() {
    const client = this.container.get("client");
    client.removeAllListeners("guildMemberAdd");
    client.removeAllListeners("guildMemberRemove");
  }
};