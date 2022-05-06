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
// Set crosschat channel
// ------------------------------------------------------------------------------

const setCrossChatChannel = {
    options: {
        name: 'set_crosschat_channel',
        description: 'Set the crosschat channel',
        type: OPTION.SUB_COMMAND,
        options: [
            {
                name: 'channel',
                description: 'The channel to set',
                type: OPTION.CHANNEL,
                channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
                required: true,
            },
        ],
    },
    execute: async function (interaction) {
        const crosschatChannel = interaction.options.getChannel('channel').id
        const channel = interaction.channel
        const guildId = interaction.guild.id
        const token = interaction.token
        const whId = interaction.id
        channel.createWebhook('CrossChat', {
            avatar: 'https://cdn.discordapp.com/attachments/955266949447811072/972236599540711484/Screen_Shot_2022-04-07_at_3.51.20_PM.png',
            reason: 'Corebot CrossChat Webhook!'
          })
            .then(console.log)
            .catch(console.error)
        await updateCrossChat(guildId, crosschatChannel, token, whId)
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
        setCrossChatChannel.options,
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