const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),

  async execute(interaction, container) {
    const client = container.get("client");
    
    // Using a template literal to show the WebSocket heartbeat
    await interaction.reply(`🏓 Pong! \`${client.ws.ping}ms\``);
  }
};