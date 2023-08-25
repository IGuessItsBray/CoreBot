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
  AttachmentBuilder,
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const {
  setAvatar,
  createMember,
  setTags,
  setColor,
  getMembers,
} = require("../../db/dbProxy");
const axios = require("axios");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "export",
  description: "Export your collection to JSON",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const owner = interaction.user.id;
    const members = await getMembers(owner);
    //console.log(members)
    const file = new AttachmentBuilder(
      Buffer.from(JSON.stringify(members ?? [], null, "  ")),
      { name: `${owner}.json` }
    );
    await interaction.reply({ files: [file], ephemeral: true });
  },

  // ------------------------------------------------------------------------------
};
