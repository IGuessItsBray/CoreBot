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

  name: "kick",
  description: "Allows the admin or owner to kick the member.",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.KickMembers],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "user",
      description: "The person who you want to kick",
      type: OPTION.USER,
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
    const length = interaction.options.getNumber("length");
    const member = interaction.options.getMember("user");
    const guildId = interaction.guild.id;
    const user = member.id;
    const message = reason;
    const staffUser = interaction.member;
    const timestamp = interaction.createdTimestamp;

    try {
      await member.user
        .send(
          `You were kicked from **\`${interaction.guild.name}\`** for \`${reason}\``
        )
        .catch((err) => {});
      await member.kick({ days: length, reason: reason });
      await interaction.reply(`${member} kicked by ${interaction.member}`);
      const type = "KICK";
      const staffUser = interaction.member.id;
      addPunishments(guildId, user, type, message, timestamp, staffUser);
    } catch (e) {
      console.error(e);
      await interaction.reply("failure, see console");
    }
  },

  // ------------------------------------------------------------------------------
};
