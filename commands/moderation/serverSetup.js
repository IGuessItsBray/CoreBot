const {
  EmbedBuilder,
  Collection,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ChannelType,
} = require("discord.js");
const { OPTION } = require("../../util/enum").Types;
const cmdUtils = require("../../util/commandUtils");
const { setLogChannel } = require("../../db/dbAccess");

// ------------------------------------------------------------------------------
// Set audit log channel
// ------------------------------------------------------------------------------

const setAuditLogChannel = {
  options: {
    name: "set_auditlog_channel",
    description: "Set the audit logging channel",
    type: OPTION.SUB_COMMAND,
    options: [
      {
        name: "channel",
        description: "The channel to set the logs to",
        type: OPTION.CHANNEL,
        channelTypes: [
          ChannelType.GuildText,
          ChannelType.GuildPublicThread,
          ChannelType.PrivateThread,
          ChannelType.PublicThread,
        ],
        required: true,
      },
    ],
  },

  execute: async function (interaction) {
    const channelId = interaction.options.getChannel("channel").id;
    const guildId = interaction.guild.id;
    const name = interaction.guild.name;
    await setLogChannel(guildId, channelId, name);
    await interaction.editReply({ content: "Channel set!", ephemeral: true });
  },
};

// ------------------------------------------------------------------------------
// Command Execution
// ------------------------------------------------------------------------------

module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "serversettings",
  description: "Setup your server!",
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [setAuditLogChannel.options],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction, ephemeral = true) {
    await interaction.deferReply({ ephemeral });

    switch (interaction.options.getSubcommand()) {
      case setAuditLogChannel.options.name:
        setAuditLogChannel.execute(interaction);
        break;
    }
  },
};
