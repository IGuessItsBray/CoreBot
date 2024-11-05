const {
  CommandInteraction,
  EmbedBuilder,
  Intents,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { PermissionFlagsBits, ButtonStyle } = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "feedback",
  description: "Send feedback to the dev team!",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "message",
      description: "The feedback",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "image",
      description: "Any images",
      type: OPTION.ATTACHMENT,
      required: false,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.options.getString("message");
    const image = interaction.options.getAttachment("image");
    const user = interaction.user;
    const guild = interaction.guild.name;
    const channel = interaction.client.channels.cache.get(
      "1016052055883911219"
    );
    const embed = new EmbedBuilder()
      .setColor("#0000FF")
      .setAuthor({ name: `Feedback from ${user.tag}` })
      .setDescription(
        `New feedback from <@${user.id}> in ${guild}
\`\`\`
${message}
\`\`\``
      )
      .setFooter({ text: "Corebot" })
      .setTimestamp();
    await channel.send({
      embeds: [embed],
      files: image ? [{ attachment: image.url }] : undefined,
    });
    await interaction.editReply({
      content: "Thanks! Your feedback has been sent to the dev team!",
      ephemeral: true,
    });
  },

  // ------------------------------------------------------------------------------
};
