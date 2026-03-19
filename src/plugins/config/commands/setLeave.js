const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const Guild = require("../../../models/Guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setleave")
    .setDescription("Configure the leave message and channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt => 
      opt.setName("channel").setDescription("Where to send messages").addChannelTypes(ChannelType.GuildText).setRequired(true)
    )
    .addStringOption(opt => 
      opt.setName("message").setDescription("The message. Use ${user} and ${guild} as variables.").setRequired(true)
    ),

  async execute(interaction, container) {
    const channel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("message");
    const config = container.get("config");

    await Guild.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { leave: { channelId: channel.id, message: message, enabled: true } },
      { upsert: true }
    );

    if (config.clearCache) await config.clearCache(interaction.guild.id);

    await interaction.reply({ content: `✅ Leave messages set to ${channel} with your custom text.`, ephemeral: true });
  }
};