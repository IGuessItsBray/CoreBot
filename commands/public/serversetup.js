const { MessageEmbed, Collection } = require('discord.js');
const { OPTION } = require('../../util/enum').Types;
const cmdUtils = require('../../util/commandUtils');
const { updateGuild, updateCrossChat } = require('../../db/dbAccess');

// ------------------------------------------------------------------------------
// Set audit log channel
// ------------------------------------------------------------------------------

const setAuditLogChannel = {
    options: {
        name: 'set_auditlog_channel',
        description: 'Set the audit logging channel',
        type: OPTION.SUB_COMMAND,
        options: [
            {
                name: 'channel',
                description: 'The channel to set the logs to',
                type: OPTION.CHANNEL,
                channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
                required: true,
            },
        ],
    },
    execute: async function (interaction) {
        const channelId = interaction.options.getChannel('channel').id
        const guildId = interaction.guild.id
        await updateGuild(guildId, channelId)
        await interaction.editReply({ content: 'Channel set!', ephemeral: true });

    },
};


// ------------------------------------------------------------------------------
// Command Execution
// ------------------------------------------------------------------------------

module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'serversettings',
    description: 'Setup your server!',
    type: '1',
    enabled: true,

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        setAuditLogChannel.options,
    ],

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