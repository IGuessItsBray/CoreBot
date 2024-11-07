const {
  PermissionFlagsBits,
  ButtonStyle,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ActionRowBuilder
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const { messageComponentCollector } = require("../../util/genUtils")
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "error",
  description: "Force an error code on this command",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    //{
    //name: '',
    //description: '',
    //type: ApplicationCommandOptionType.String,
    //required: true,
    //},
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction) {
    //console.log(lol)
    const button = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm Ban')
      .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder()
      .addComponents(button);
    const i = await interaction.reply({
      content: `Error`,
      components: [row],
      fetchReply: true,
    });
    const buttonInteraction = await messageComponentCollector(i, 5)
    if (!buttonInteraction) return await interactionReply.edit({ content: 'Button Interaction Timed Out!', components: [] });
    console.log(lol)
    await buttonInteraction.update({
      content: `${buttonInteraction.customId} - Button Clicked!`,
      components: [],
    });
  },

  // ------------------------------------------------------------------------------
};
