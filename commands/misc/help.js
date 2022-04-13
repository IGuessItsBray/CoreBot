const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'help',
    description: 'Replies with the bots information and commands',
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
            .setColor("RANDOM")
            .setAuthor({
                name: "Help and Info!",
                iconURL: guild.iconURL({ dynamic: true }),
            })
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: "***Bot Info***",
                    value: [
                        `Name: <@950525282434048031>`,
                        `Bot Owner: <@530845321270657085>`,
                        //`Created: <t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
                        `Description: This bot is a multi-purpose Discord bot, Coded in Discord.js by <@530845321270657085> containing work from <@111592329424470016>`,
                    ].join("\n"),
                },
                {
                    name: "***Commmands***",
                    value: [
                        `**Bug's Server**: 
              -*/Tiktok* ~ Gives a link to <@945202997435203644>'s tiktok`,
                        `**Bray's Place**: *Coming soon*`,
                        `**KW Cadets**: *Coming soon*`,
                        `**Global Commands**: 
              -*/echo* ~ Echo's a message from the bot (Mod only)
              -*/help* ~ Displays this message
              -*/serverinfo* ~ Displays information about the server`,
                    ].join("\n"),
                },
                {
                    name: "***Features***",
                    value: [
                        `Corebot also contains other features, such as:`,
                        `Connect To Voice - always active connection to a VC`,
                        `24/7 Hosting`,
                        `ModMail support`,
                        `Music support`,
                        `React roles via Discord buttons`,
                        `Audit Logs`,
                        `Join and Leave messages`,
                        `Cross Server Chat`,
                    ].join("\n"),
                },
                {
                    name: "***Coming soon!***",
                    value: [
                        `Twitch live alerts`,
                    ].join("\n"),
                },
                {
                    name: "***Credits***",
                    value: [
                        `Credits to <@111592329424470016> for ConnectToVoice, Echo and development help`,
                        `Credits to Khaaz for Cross Server Chat`,
                        `Credits to FlisherOfatale for audit logs`,
                    ].join("\n"),
                }
            )
            .setFooter({ text: "Contact Bray#1051 with any issues, questions, or suggestions!" })
            .setTimestamp();

        interaction.reply({ embeds: [Embed] });
    },

    // ------------------------------------------------------------------------------
};