const { MessageEmbed, Collection } = require('discord.js');
const { OPTION } = require('../../util/enum').Types;
const cmdUtils = require('../../util/commandUtils');
const { updateGuild, setCrossChatChannel, setReportChannel, setJoin, setLeave, setVerifyChannel, setVerifyPassword, setVerifySuccessMessage, setVerifyFailMessage, setVerifyRoleAdd, updateModmailChannel, setMediaChannel } = require('../../db/dbAccess');

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
// Set Join info
// ------------------------------------------------------------------------------

const setJoinInfo = {
    options: {
        name: 'set_join_info',
        description: 'Set the join info',
        type: OPTION.SUB_COMMAND,
        options: [
            {
                name: 'channel',
                description: 'The channel to set join messages to',
                type: OPTION.CHANNEL,
                channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
                required: true,
            },
            {
                name: 'message',
                description: 'The message to send when a user joins',
                type: OPTION.STRING,
                required: true,
            },
        ],
    },

    execute: async function (interaction) {
        const channel = interaction.options.getChannel('channel').id
        const guildId = interaction.guild.id
        const message = interaction.options.getString('message')
        await setJoin(guildId, channel, message)
        await interaction.editReply({ content: 'Channel set!', ephemeral: true });

    },

};
// ------------------------------------------------------------------------------
// Set Leave info
// ------------------------------------------------------------------------------

const setLeaveInfo = {
    options: {
        name: 'set_leave_info',
        description: 'Set the leave info',
        type: OPTION.SUB_COMMAND,
        options: [
            {
                name: 'channel',
                description: 'The channel to set leave messages to',
                type: OPTION.CHANNEL,
                channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
                required: true,
            },
            {
                name: 'message',
                description: 'The message to send when a user leaves',
                type: OPTION.STRING,
                required: true,
            },
        ],
    },

    execute: async function (interaction) {
        const channel = interaction.options.getChannel('channel').id
        const guildId = interaction.guild.id
        const message = interaction.options.getString('message')
        await setLeave(guildId, channel, message)
        await interaction.editReply({ content: 'Channel set!', ephemeral: true });

    },

};
// ------------------------------------------------------------------------------
// Set Verify
// ------------------------------------------------------------------------------

const setVerifyConfig = {
    options: {
        name: 'verify_config',
        description: 'Setup verify in your server',
        type: OPTION.SUB_COMMAND,
        options: [
            {
                name: 'channel',
                description: 'The Channel to verify within',
                type: OPTION.CHANNEL,
                required: false,
            },
            {
                name: 'password',
                description: 'The password (write it down)',
                type: OPTION.STRING,
                required: false,
            },
            {
                name: 'role',
                description: 'The role to add after verified',
                type: OPTION.ROLE,
                required: false,
            },
            {
                name: 'passmessage',
                description: 'The message after someone verifies successfully',
                type: OPTION.STRING,
                required: false,
            },
            {
                name: 'failmessage',
                description: 'The message after someone verifies unsuccessfully',
                type: OPTION.STRING,
                required: false,
            },
        ],
    },

    execute: async function (interaction) {
        const password = interaction.options.getString('password');
        const passmsg = interaction.options.getString('passmessage');
        const failmsg = interaction.options.getString('failmessage');
        const role = interaction.options.getRole('role');
        const channel = interaction.options.getChannel('channel');
        if (channel) await setVerifyChannel(interaction.guild.id, channel.id)
        if (role) await setVerifyRoleAdd(interaction.guild.id, role.id)
        if (failmsg) await setVerifyFailMessage(interaction.guild.id, failmsg)
        if (passmsg) await setVerifySuccessMessage(interaction.guild.id, passmsg)
        if (password) await setVerifyPassword(interaction.guild.id, password)
        interaction.editReply({
            ephemeral: true, content: `Verify information set - please take note of the password!
        Channel: ${channel}
        Password: ${password}`
        })
    },

};
// ------------------------------------------------------------------------------
// Set Modmail Channel
// ------------------------------------------------------------------------------
const setModmailChannel = {
    options: {
        name: 'set_modmail_channel',
        description: 'Set the hub for modmail Threads',
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
        const channelId = interaction.options.getChannel('channel').id
        const guildId = interaction.guild.id
        await updateModmailChannel(guildId, channelId)
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
        setReportingChannel.options,
        setJoinInfo.options,
        setLeaveInfo.options,
        setVerifyConfig.options,
        setModmailChannel.options
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
            case setJoinInfo.options.name:
                setJoinInfo.execute(interaction);
                break;
            case setLeaveInfo.options.name:
                setLeaveInfo.execute(interaction);
                break;
            case setVerifyConfig.options.name:
                setVerifyConfig.execute(interaction);
                break;
            case setModmailChannel.options.name:
                setModmailChannel.execute(interaction);
                break;
        }
    },

};