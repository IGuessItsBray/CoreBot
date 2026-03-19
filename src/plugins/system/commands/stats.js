const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Displays bot performance and system status."),

  async execute(interaction, container) {
    const client = container.get("client");
    const systemPlugin = container.get("pluginLoader").pluginManager.plugins.get("system");
    
    // Calculate Uptime
    const uptimeMS = Date.now() - (systemPlugin?.bootTime || Date.now());
    const uptime = new Date(uptimeMS).toISOString().substr(11, 8);

    // Memory usage in MB
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = new EmbedBuilder()
      .setTitle("System Status")
      .setColor(0x5865F2)
      .addFields(
        { name: "Uptime", value: `\`${uptime}\``, inline: true },
        { name: "Memory", value: `\`${memory} MB\``, inline: true },
        { name: "Node.js", value: `\`${process.version}\``, inline: true },
        { name: "Platform", value: `\`${os.platform()} (${os.arch()})\``, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};