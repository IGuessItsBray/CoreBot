const { EmbedBuilder, Channel } = require("discord.js");
const {
  PermissionFlagsBits,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { getServerSettings } = require("../../db/dbAccess");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "verify",
  description: "Verify yourself!",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "password",
      description: "The server password",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, ephemeral = true) {
    const guildId = interaction.guild.id;
    const verify = await getServerSettings(guildId);
    const pass = interaction.options.getString("password");
    if (verify.password == pass) {
      interaction.member.roles.add(verify.addRole);
      interaction.reply({ ephemeral: true, content: verify.successMessage });
    }
    if (verify.password !== pass) {
      interaction.reply({ ephemeral: true, content: verify.failMessage });
    }
  },

  // ------------------------------------------------------------------------------
};
