const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'tag1',
    description: 'Music Release Tag!',
    type: 'CHAT_INPUT',
    guild_id: [],
    enabled: true,
    default_permission: true,
    permissions: [],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction, ephemeral = false) {
        const { guild } = interaction;
        const target = await interaction.guild.members.fetch(interaction.targetId);
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
    },

    // ------------------------------------------------------------------------------
};