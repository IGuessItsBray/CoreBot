const { time } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const {
  PermissionFlagsBits,
  ButtonStyle,
  ApplicationCommandType,
} = require("discord.js");
const { COMMAND, OPTION, CHANNEL } = require("../../util/enum").Types;
const { setMmCatagory, setMmChannel } = require("../../db/dbAccess");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "setchannel",
  description: "Set the channel of ticket logs",
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  permissions: [PermissionFlagsBits.SendMessages],

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: "channel",
      description: "The channel to send logs to",
      type: OPTION.CHANNEL,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, client, ephemeral = true) {
    const channel = interaction.options.getChannel("channel");
    const guildId = interaction.guild.id;
    await setMmChannel(guildId, channel);
    interaction.reply("Channel set!");
  },

  // ------------------------------------------------------------------------------
};
