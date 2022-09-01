const { MessageEmbed, Collection } = require('discord.js');
const { OPTION } = require('../../util/enum').Types;
const cmdUtils = require('../../util/commandUtils');
const { updateGuild, setCrossChatChannel, setReportChannel } = require('../../db/dbAccess');

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

const setCcChannel = {
    options: {
        name: 'set_crosschat_channel',
        description: 'Set the crosschat channel',
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
        const channel = interaction.options.getChannel('channel')
        const channelId = interaction.options.getChannel('channel').id
        const guildId = interaction.guild.id
        const webhook = await channel.createWebhook('CoreBot | CrossChat', {
            avatar: 'https://cdn.discordapp.com/attachments/968344820970029136/1014940658009653248/Screen_Shot_2022-04-07_at_3.51.20_PM.png',
        })
        const whId = webhook.id

        const whToken = webhook.token

        await setCrossChatChannel(guildId, channelId, whId, whToken)
        await interaction.editReply({ content: 'Channel set!', ephemeral: true });

    },

};
// ------------------------------------------------------------------------------
// Set report channel
// ------------------------------------------------------------------------------

const setReportingChannel = {
    options: {
        name: 'set_report_channel',
        description: 'Set the report channel',
        type: OPTION.SUB_COMMAND,
        options: [
            {
                name: 'channel',
                description: 'The channel to set the reports to',
                type: OPTION.CHANNEL,
                channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
                required: true,
            },
        ],
    },

    execute: async function (interaction) {
        const channelId = interaction.options.getChannel('channel').id
        const guildId = interaction.guild.id
        await setReportChannel(guildId, channelId)
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
        setCcChannel.options,
        setReportingChannel.options
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
            case setCcChannel.options.name:
                setCcChannel.execute(interaction);
                break;
            case setReportingChannel.options.name:
                setReportingChannel.execute(interaction);
                break;
        }
    },

};