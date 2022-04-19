const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'reminder',
    description: 'For setting a reminder',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: false,
    permissions: [
        ...admin_roles.map(role => {
            return {
                id: role,
                type: 'ROLE',
                permission: true,
            };
        }),
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
    ],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'message',
            description: 'The message you want to send',
            type: 'STRING',
            required: true,
        },
        {
            name: 'channel',
            description: 'The channel you want to send the message in (leave blank for this channel)',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
            required: false,
        },
        {
            name: 'seconds',
            description: 'the amount of seconds',
            type: 'NUMBER',
            required: false,
        },
        {
            name: 'minutes',
            description: 'The amount of minutes',
            type: 'NUMBER',
            required: false,
        },
        {
            name: 'hours',
            description: 'The amount of hours',
            type: 'NUMBER',
            required: false,
        },
        {
            name: 'days',
            description: 'The amount of days',
            type: 'NUMBER',
            required: false,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const seconds = interaction.options.getNumber('seconds');
        const minutes = (interaction.options.getNumber('minutes') ?? 0) / 60;
        const hours = (interaction.options.getNumber('hours') ?? 0) / 60 / 60;
        const days = (interaction.options.getNumber('days') ?? 0) / 60 / 60 / 24;
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;
        setTimeout(function () {
            channel.send(`Reminder for: ${interaction.user}:`)
            channel.send({ content: message });;
        }, (seconds + minutes + hours + days) * 1000);


        await interaction.editReply(`Reminder set: ${message}`, { ephemeral: true });
    },

    // ------------------------------------------------------------------------------
};