const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
  PermissionsBitField,
  PermissionFlagsBits,
  ChannelType,
  AttachmentBuilder,
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const { addPunishments } = require("../../db/dbAccess");

module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "unban",
  description: "Unban a member from your server.",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.BanMembers],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "user",
      description: "The person who you want to kick",
      type: OPTION.STRING,
      required: true,
    },
    {
      name: "reason",
      description: "Reason to kick member",
      type: OPTION.STRING,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const reason = interaction.options.getString("reason");
    const u = interaction.options.getString("user");
    const member = await interaction.client.users.fetch(u);
    const guildId = interaction.guild.id;
    const user = member.id;
    const message = reason;
    const staffUser = interaction.member;
    const timestamp = interaction.createdTimestamp;
    const guild = interaction.guild

    try {
      await guild.bans.remove(member)
      await interaction.reply(`<@${user}> unbanned by ${interaction.member}`);
      const type = "UNBAN";
      const staffUser = interaction.member.id;
      addPunishments(guildId, user, type, message, timestamp, staffUser);
    } catch (e) {
      console.error(e);
      await interaction.reply("failure, see console");
    }
  },

  // ------------------------------------------------------------------------------
};
