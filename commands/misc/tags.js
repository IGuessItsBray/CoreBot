const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'tags',
    description: 'Test tags.',
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
            name: 'tag',
            description: 'The tag to send',
            type: 'STRING',
            choices: [
                { name: '1', value: 'tag1' },
                { name: '2', value: 'tag2' },
            ],
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    
    async execute(interaction, ephemeral = false) {
        const type = interaction.options.getString('tag');
        const { guild } = interaction;
        const target = await interaction.guild.members.fetch(interaction.targetId);
        if (type === 'tag1') {
        const Embed = new MessageEmbed()
            .setColor("000000")
            .addFields(
                {
                    name: "Tag Test.",
                    value: [
                        `This is an example of the Corebot tags.`,
                    ].join("\n"),
                },
            )
            .setFooter({ text: "o/ Hi There" })
            .setTimestamp();

        interaction.reply({ embeds: [Embed] });
        }
        else if (type === 'tag2') {
            const Embed = new MessageEmbed()
            .setColor("5865F2")
            .setAuthor({
                name: "🎵Music!🎵",
                iconURL: guild.iconURL({ dynamic: true }),
            })
            .addFields(
                {
                    name: "🎵Music!🎵",
                    value: [
                        `Welcome to <@950525282434048031> Music!`,
                    ].join("\n"),
                },
            )
            .addFields(
                {
                    name: "About!",
                    value: [
                        `Corebot music is a fork of Jagrosh's MusicBot, which can be viewed at https://github.com/jagrosh/MusicBot/releases/latest`,
                    ].join("\n"),
                },
            )
            .addFields(
                {
                    name: "Prefix",
                    value: [
                        `The bot prefix is <@950525282434048031>`,
                    ].join("\n"),
                },
            )
            .addFields(
                {
                    name: "General Commands",
                    value: [
                        `about`,
                        `ping`,
                        `settings`,
                    ].join("\n"),
                },
            )
            .addFields(
                {
                    name: "Music Commands",
                    value: [
                        `lyrics [songname]`,
                        `nowplaying [alais np, current]`,
                        `play [songname]`,
                        `play [URL]`,
                        `queue [page#]`,
                        `remove [song#]`,
                        `remove all`,
                        `shuffle`,
                        `skip`,
                    ].join("\n"),
                },
            )
            .setFooter({ text: "o/ Hi There" })
            .setTimestamp();

        interaction.reply({ embeds: [Embed] });
        }
    },

    // ------------------------------------------------------------------------------
};