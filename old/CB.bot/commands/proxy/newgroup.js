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
const { createGroup } = require("../../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "newgroup",
  description: "Create a new proxy group",
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
    const guildId = interaction.guild.id;
    const modal = new ModalBuilder()
      .setCustomId("newgroup")
      .setTitle("New Group!");
    const n = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("Name")
      .setStyle("Short")
      .setPlaceholder("Name your proxy group!")
      .setRequired(true);
    const d = new TextInputBuilder()
      .setCustomId("desc")
      .setLabel("Description")
      .setStyle("Paragraph")
      .setPlaceholder("Write a short description about your group!")
      .setRequired(false);
    const row = new ActionRowBuilder().addComponents(n);
    const row2 = new ActionRowBuilder().addComponents(d);
    modal.addComponents(row, row2);
    await interaction.showModal(modal);
    interaction.client.on(Events.InteractionCreate, async (interaction) => {
      if (
        interaction.isModalSubmit() &&
        interaction.customId.startsWith("newgroup")
      ) {
        const owner = interaction.user.id;
        const guild = interaction.guild;
        const name = interaction.fields.getTextInputValue("name");
        const desc = interaction.fields.getTextInputValue("desc");
        const embed = new EmbedBuilder()
          .setColor("#3a32a8")
          .setAuthor({ name: "New Group created!" })
          .setDescription(
            `
Name: ${name}
Description: ${desc}`
          )
          .setFooter({ text: `CoreBot` })
          .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        await createGroup(owner, name, desc);
      }
    });
  },

  // ------------------------------------------------------------------------------
};
