const { time } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandType,
} = require("discord.js");
const { ButtonStyle } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const {
  getMmCatagory,
  getMmChannel,
  setMmInfo,
  getMmInfo,
  deleteMmInfo,
} = require("../../db/dbAccess");
const { PermissionFlagsBits, PermissionsBitField } = require("discord.js");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "closeticket",
  description: "Close a modmail ticket",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "user",
      description: "The tickets owner",
      type: OPTION.USER,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const guildId = interaction.guild.id;
    const userId = interaction.options.getMember("user").id;
    const mmInfo = await getMmInfo(guildId, userId);
    const channel = mmInfo.channelId;
    const channelId = channel;
    const lc = await getMmChannel(guildId);
    const logChannel = await interaction.client.channels.fetch(lc.channel);
    if (interaction.channel.id != channel) {
      interaction.reply(
        `Please run this command inside of <#${channel}> to close the thread`
      );
    }
    if (interaction.channel.id === channel) {
      interaction.reply("Deleting thread...");
      interaction.guild.channels.delete(channel);
      const embed = new EmbedBuilder()
        .setColor("#3a32a8")
        .setAuthor({ name: "New Ticket" })
        .setDescription(
          `The ticket for <@${userId}> was closed by <@${interaction.user.id}>`
        )
        .setFooter({ text: `CoreBot` })
        .setTimestamp();
      await logChannel.send({ embeds: [embed] });
      await deleteMmInfo(guildId, userId, channelId);
    }
  },

  // ------------------------------------------------------------------------------
};
