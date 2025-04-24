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

  name: "ban",
  description: "Allows the admin or owner to ban the member.",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.BanMembers],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "user",
      description: "The person who you want to ban",
      type: OPTION.USER,
      required: true,
    },
    {
      name: "reason",
      description: "Reason to ban member",
      type: OPTION.STRING,
      required: true,
    },
    {
      name: "length",
      description: "Number of days to delete messages (0-7)",
      type: OPTION.NUMBER,
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
          `You are banned from **\`${interaction.guild.name}\`** for \`${reason}\`, you can appeal by contacting server staff!`
        )
        .catch((err) => {});
      await member.ban({ days: length, reason: reason });
      await interaction.reply(`${member} banned by ${interaction.member}`);
      const type = "BAN";
      const staffUser = interaction.member.id;
      addPunishments(guildId, user, type, message, timestamp, staffUser);
    } catch (e) {
      console.error(e);
      await interaction.reply("failure, see console");
    }
  },

  // ------------------------------------------------------------------------------
};
