const { time } = require("@discordjs/builders");
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
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const { setAPState } = require("../../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "autoproxy",
  description: "enable or disable autoproxy",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "autoproxy",
      description: "Is autoproxy set to ON (true) or OFF (false)?",
      type: OPTION.BOOLEAN,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const id = interaction.user.id;
    const ap = interaction.options.getBoolean("autoproxy");
    await setAPState(id, ap);
    interaction.reply(`Autoproxy status set to ${ap}`);
  },

  // ------------------------------------------------------------------------------
};
