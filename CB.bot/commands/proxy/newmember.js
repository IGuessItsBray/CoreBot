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
const { createMember } = require("../../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "newmember",
  description: "Create a new proxy member",
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
      .setCustomId("newmember")
      .setTitle("New Member!");
    const n = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("Name")
      .setStyle("Short")
      .setPlaceholder("Name your proxy member!")
      .setRequired(true);
    const prns = new TextInputBuilder()
      .setCustomId("prns")
      .setLabel("Pronouns")
      .setStyle("Short")
      .setPlaceholder("Give your member pronouns")
      .setRequired(true);
    const d = new TextInputBuilder()
      .setCustomId("desc")
      .setLabel("Description")
      .setStyle("Paragraph")
      .setPlaceholder("Write a short description about your member!")
      .setRequired(false);
    const row = new ActionRowBuilder().addComponents(n);
    const row2 = new ActionRowBuilder().addComponents(prns);
    const row3 = new ActionRowBuilder().addComponents(d);
    modal.addComponents(row, row2, row3);
    await interaction.showModal(modal);
    interaction.client.on(Events.InteractionCreate, async (interaction) => {
      if (
        interaction.isModalSubmit() &&
        interaction.customId.startsWith("newmember")
      ) {
        const owner = interaction.user.id;
        const guild = interaction.guild;
        const name = interaction.fields.getTextInputValue("name");
        const desc = interaction.fields.getTextInputValue("desc");
        const pronouns = interaction.fields.getTextInputValue("prns");
        const embed = new EmbedBuilder()
          .setColor("#3a32a8")
          .setAuthor({ name: "New Member created!" })
          .setDescription(
            `
Name: ${name}
Pronouns: ${pronouns}
Description: ${desc}`
          )
          .setFooter({ text: `CoreBot` })
          .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        await createMember(owner, name, desc, pronouns);
      }
    });
  },

  // ------------------------------------------------------------------------------
};
